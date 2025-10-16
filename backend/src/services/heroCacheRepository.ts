import {
  DynamoDBClient,
  type DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import {
  AWS_REGION,
  DYNAMODB_ENDPOINT,
  HERO_CACHE_TABLE,
  HERO_CACHE_TTL_SECONDS,
} from "../config.js";

let documentClient: DynamoDBDocumentClient | null = null;

function isDynamoEnabled(): boolean {
  return Boolean(HERO_CACHE_TABLE && (AWS_REGION || DYNAMODB_ENDPOINT));
}

function getDocumentClient(): DynamoDBDocumentClient {
  if (!documentClient) {
    const config: DynamoDBClientConfig = {};
    if (AWS_REGION) {
      config.region = AWS_REGION;
    }
    if (DYNAMODB_ENDPOINT) {
      config.endpoint = DYNAMODB_ENDPOINT;
    }

    const client = new DynamoDBClient(config);
    documentClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return documentClient;
}

export async function getCacheItem<T>(key: string): Promise<T | undefined> {
  if (!isDynamoEnabled()) {
    return undefined;
  }

  try {
    const client = getDocumentClient();
    const response = await client.send(
      new GetCommand({
        TableName: HERO_CACHE_TABLE,
        Key: { pk: key },
        ConsistentRead: false,
      })
    );

    const item = response.Item as
      | { payload?: string; ttl?: number }
      | undefined;
    if (!item) {
      return undefined;
    }

    if (item.ttl && item.ttl * 1000 < Date.now()) {
      return undefined;
    }

    if (!item.payload) {
      return undefined;
    }

    return JSON.parse(item.payload) as T;
  } catch (error) {
    console.warn("Skipping DynamoDB cache read due to error", error);
    return undefined;
  }
}

export async function setCacheItem<T>(
  key: string,
  value: T,
  ttlMs: number
): Promise<void> {
  if (!isDynamoEnabled()) {
    return;
  }

  try {
    const client = getDocumentClient();
    const nowSeconds = Math.floor(Date.now() / 1000);
    const requestedDurationSeconds = Math.max(Math.floor(ttlMs / 1000), 60);
    const ttlDurationSeconds =
      HERO_CACHE_TTL_SECONDS != null && Number.isFinite(HERO_CACHE_TTL_SECONDS)
        ? Math.max(Number(HERO_CACHE_TTL_SECONDS), 60)
        : requestedDurationSeconds;
    const ttl = nowSeconds + ttlDurationSeconds;

    await client.send(
      new PutCommand({
        TableName: HERO_CACHE_TABLE,
        Item: {
          pk: key,
          payload: JSON.stringify(value),
          ttl,
          updatedAt: Date.now(),
        },
      })
    );
  } catch (error) {
    console.warn("Skipping DynamoDB cache write due to error", error);
  }
}
