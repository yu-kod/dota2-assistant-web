import axios from "axios";

import {
  DEFAULT_LANGUAGE,
  DETAIL_CACHE_TTL_MS,
  HERO_DETAIL_URL,
  HERO_LIST_URL,
  LIST_CACHE_TTL_MS,
} from "../config.js";
import type { HeroDetail, HeroSummary } from "../types/app.js";
import type {
  DotaHeroDetail,
  DotaHeroDetailResponse,
  DotaHeroListResponse,
  DotaHeroSummary,
} from "../types/dota.js";
import { TTLCache } from "../utils/cache.js";

import { getCacheItem, setCacheItem } from "./heroCacheRepository.js";

const listCache = new TTLCache<string, HeroSummary[]>(LIST_CACHE_TTL_MS);
const detailCache = new TTLCache<string, HeroDetail>(DETAIL_CACHE_TTL_MS);

const HERO_IMAGE_BASE_URL =
  "https://cdn.steamstatic.com/apps/dota2/images/dota_react/heroes";

const POSITION_LABELS = [
  "Position 1 (Carry)",
  "Position 2 (Mid)",
  "Position 3 (Offlane)",
  "Position 4 (Soft Support)",
  "Position 5 (Hard Support)",
  "Core",
  "Support",
] as const;
export type PositionLabel = (typeof POSITION_LABELS)[number];

function buildHeroImageUrl(heroName: string): string {
  // Convert hero internal name to image filename
  // e.g., "npc_dota_hero_antimage" -> "antimage"
  const imageName = heroName.replace("npc_dota_hero_", "");
  return `${HERO_IMAGE_BASE_URL}/${imageName}.png`;
}

function inferPositions(hero: DotaHeroSummary): PositionLabel[] {
  const roles = hero.roles ?? [];
  const positions = new Set<PositionLabel>();

  if (roles.includes("Carry")) {
    positions.add("Position 1 (Carry)");
    positions.add("Core");
    positions.add("Position 2 (Mid)");
  }

  if (roles.includes("Nuker") || roles.includes("Escape")) {
    positions.add("Position 2 (Mid)");
  }

  if (roles.includes("Durable") || roles.includes("Initiator")) {
    positions.add("Position 3 (Offlane)");
    positions.add("Core");
  }

  if (roles.includes("Support")) {
    positions.add("Support");
    positions.add("Position 4 (Soft Support)");
    if (!roles.includes("Carry")) {
      positions.add("Position 5 (Hard Support)");
    }
  }

  if (roles.includes("Disabler") && !roles.includes("Carry")) {
    positions.add("Position 4 (Soft Support)");
  }

  if (positions.size === 0) {
    positions.add("Core");
  }

  return Array.from(positions);
}

function normaliseHeroSummary(hero: DotaHeroSummary): HeroSummary {
  const shortName = hero.name?.replace("npc_dota_hero_", "") || "";

  // Convert numeric primary_attr to string
  let primaryAttr: "str" | "agi" | "int" = "str";
  if (typeof hero.primary_attr === "number") {
    switch (hero.primary_attr) {
      case 0:
        primaryAttr = "str";
        break;
      case 1:
        primaryAttr = "agi";
        break;
      case 2:
        primaryAttr = "int";
        break;
      default:
        primaryAttr = "str";
    }
  } else if (typeof hero.primary_attr === "string") {
    primaryAttr = hero.primary_attr as "str" | "agi" | "int";
  }

  return {
    id: hero.id,
    name: hero.name || "",
    localizedName:
      hero.name_loc ||
      hero.name_english_loc ||
      hero.localized_name ||
      hero.name ||
      "",
    shortName,
    primaryAttr,
    attackType: hero.attack_type || "Melee",
    roles: hero.roles ?? [],
    positions: inferPositions(hero),
    complexity:
      typeof hero.complexity === "number" ? hero.complexity : undefined,
    image: buildHeroImageUrl(hero.name || ""),
    icon: buildHeroImageUrl(hero.name || ""),
  };
}

function pickHeroDetail(
  data: DotaHeroDetailResponse
): DotaHeroDetail | undefined {
  return data?.result?.data?.hero ?? data.hero;
}

function normaliseHeroDetail(
  summary: HeroSummary,
  detail: DotaHeroDetail
): HeroDetail {
  return {
    ...summary,
    baseHealth: detail.base_health,
    baseMana: detail.base_mana,
    baseArmor: detail.base_armor,
    baseAttackMin: detail.base_attack_min,
    baseAttackMax: detail.base_attack_max,
    baseStr: detail.base_str,
    baseAgi: detail.base_agi,
    baseInt: detail.base_int,
    moveSpeed: detail.move_speed,
    attackRange: detail.attack_range,
    turnRate: detail.turn_rate,
    abilities: detail.abilities?.map((ability) => ({
      name: ability.name,
      description: ability.description,
      cooldown: ability.cooldown,
      manaCost: ability.mana_cost,
    })),
    talents: detail.talents?.map((talent) => ({
      name: talent.name,
      description: talent.description,
    })),
    description:
      typeof detail.description === "string" ? detail.description : undefined,
  };
}

function extractHeroList(response: DotaHeroListResponse): DotaHeroSummary[] {
  if (Array.isArray(response.heroes)) {
    return response.heroes;
  }
  const nested = response.result?.data?.heroes;
  if (Array.isArray(nested)) {
    return nested;
  }
  return [];
}

export async function fetchHeroSummaries(
  language = DEFAULT_LANGUAGE
): Promise<HeroSummary[]> {
  const cacheKey = `hero-list:${language}`;
  const cached = listCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const persisted = await getCacheItem<HeroSummary[]>(cacheKey);
  if (persisted) {
    listCache.set(cacheKey, persisted);
    return persisted;
  }

  const { data } = await axios.get<DotaHeroListResponse>(HERO_LIST_URL, {
    params: { language },
    timeout: 10_000,
  });

  const heroes = extractHeroList(data).map(normaliseHeroSummary);
  listCache.set(cacheKey, heroes);
  void setCacheItem(cacheKey, heroes, LIST_CACHE_TTL_MS);
  return heroes;
}

export async function fetchHeroDetail(
  id: number,
  language = DEFAULT_LANGUAGE
): Promise<HeroDetail> {
  const detailCacheKey = `hero-detail:${language}:${id}`;
  const cached = detailCache.get(detailCacheKey);
  if (cached) {
    return cached;
  }

  const persisted = await getCacheItem<HeroDetail>(detailCacheKey);
  if (persisted) {
    detailCache.set(detailCacheKey, persisted);
    return persisted;
  }

  const summaries = await fetchHeroSummaries(language);
  const summary = summaries.find((hero) => hero.id === id);
  if (!summary) {
    throw new Error(`Hero with id ${id} not found`);
  }

  const { data } = await axios.get<DotaHeroDetailResponse>(HERO_DETAIL_URL, {
    params: { language, hero_id: id },
    timeout: 10_000,
  });

  const detailData = pickHeroDetail(data);
  if (!detailData) {
    const fallbackDetail: HeroDetail = { ...summary };
    detailCache.set(detailCacheKey, fallbackDetail, LIST_CACHE_TTL_MS);
    void setCacheItem(detailCacheKey, fallbackDetail, LIST_CACHE_TTL_MS);
    return fallbackDetail;
  }

  const normalised = normaliseHeroDetail(summary, detailData);
  detailCache.set(detailCacheKey, normalised);
  void setCacheItem(detailCacheKey, normalised, DETAIL_CACHE_TTL_MS);
  return normalised;
}
