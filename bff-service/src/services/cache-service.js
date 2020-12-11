class CacheService {
  constructor() {
    this._cache = new Map();
  }

  checkInCache(key) {
    return this._cache.has(key);
  }

  getFromCache(key) {
    console.log('I GET CACHE FOR', key);
    return this._cache.get(key);
  }

  cacheForNms(key, value, ms) {
    this._cache.set(key, value);
    console.log('I SET CACHE FOR', key, ms);
    setTimeout(() => {
      this._cache.delete(key);
      console.log('I DELETED CACHE FOR', key);
    }, ms);
  }
}

module.exports.cacheService = new CacheService();
