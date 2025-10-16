export interface DotaHeroListResponse {
  heroes?: DotaHeroSummary[];
  result?: {
    data?: {
      heroes?: DotaHeroSummary[];
    };
  };
}

export interface DotaHeroSummary {
  id: number;
  name: string;
  localized_name?: string;
  name_loc?: string;
  name_english_loc?: string;
  primary_attr?: "str" | "agi" | "int" | number;
  attack_type?: "Melee" | "Ranged";
  roles?: string[];
  img?: string;
  icon?: string;
  complexity?: number;
  [key: string]: unknown;
}

export interface DotaHeroDetailResponse {
  result?: {
    data?: {
      hero?: DotaHeroDetail;
    };
  };
  hero?: DotaHeroDetail;
}

export interface DotaHeroDetail extends DotaHeroSummary {
  base_health?: number;
  base_mana?: number;
  base_armor?: number;
  base_attack_min?: number;
  base_attack_max?: number;
  base_str?: number;
  base_agi?: number;
  base_int?: number;
  move_speed?: number;
  attack_range?: number;
  turn_rate?: number;
  complexity?: number;
  abilities?: DotaAbility[];
  talents?: DotaTalent[];
}

export interface DotaAbility {
  name: string;
  description?: string;
  ability_special?: Array<Record<string, unknown>>;
  cooldown?: number[];
  mana_cost?: number[];
}

export interface DotaTalent {
  name: string;
  description?: string;
}
