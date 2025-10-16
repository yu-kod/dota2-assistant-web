export const HERO_LIST_URL = "https://www.dota2.com/datafeed/herolist";
export const HERO_DETAIL_URL = "https://www.dota2.com/datafeed/herodata";

export const DEFAULT_LANGUAGE = "english";

export const LIST_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const DETAIL_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
interface ProcessEnv {
  env?: Record<string, string | undefined>;
}

const nodeProcess = (globalThis as { process?: ProcessEnv }).process;
const env = nodeProcess?.env ?? {};

export const PORT = env.PORT ? Number(env.PORT) : 4000;

export const AWS_REGION = env.AWS_REGION ?? env.AWS_DEFAULT_REGION;
export const DYNAMODB_ENDPOINT = env.DYNAMODB_ENDPOINT;
export const HERO_CACHE_TABLE = env.HERO_CACHE_TABLE;
export const HERO_CACHE_TTL_SECONDS = env.HERO_CACHE_TTL_SECONDS
  ? Number.parseInt(env.HERO_CACHE_TTL_SECONDS, 10)
  : undefined;
export const ALLOWED_ORIGINS = env.ALLOWED_ORIGINS;
