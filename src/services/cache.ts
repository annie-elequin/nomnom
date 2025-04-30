interface CacheData {
  value: any;
  timestamp: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheData>;
  private expirationTime: number; // in milliseconds

  private constructor() {
    this.cache = new Map();
    this.expirationTime = 24 * 60 * 60 * 1000; // 24 hours
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set(key: string, value: any): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const data = this.cache.get(key);
    if (!data) return null;

    if (Date.now() - data.timestamp > this.expirationTime) {
      this.cache.delete(key);
      return null;
    }

    return data.value;
  }
}

export default Cache.getInstance(); 