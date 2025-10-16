type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

export class TTLCache<TKey, TValue> {
  private readonly store = new Map<TKey, CacheRecord<TValue>>();

  constructor(private readonly ttlMs: number) {}

  get(key: TKey): TValue | undefined {
    const record = this.store.get(key);
    if (!record) {
      return undefined;
    }

    if (Date.now() > record.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return record.value;
  }

  set(key: TKey, value: TValue, ttlOverride?: number): void {
    const ttl = ttlOverride ?? this.ttlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  clear(): void {
    this.store.clear();
  }
}
