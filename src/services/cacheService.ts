/**
 * CacheService - キャッシュ管理サービス
 *
 * メモリベースのキャッシュサービス。
 * TTL（Time To Live）機能を持ち、検索結果やAI生成結果をキャッシュして
 * パフォーマンスを向上させる。
 */

/**
 * キャッシュエントリ
 */
interface CacheEntry<T> {
  data: T;
  expiry: number; // Unix timestamp (ms)
}

/**
 * CacheService - キャッシュ管理クラス
 */
export class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * コンストラクタ
   * @param autoCleanupIntervalMs 自動クリーンアップの間隔（ミリ秒）、0で無効化
   */
  constructor(autoCleanupIntervalMs: number = 60000) {
    if (autoCleanupIntervalMs > 0) {
      this.startAutoCleanup(autoCleanupIntervalMs);
    }
  }

  /**
   * キャッシュに値を保存
   * @param key キャッシュキー
   * @param data 保存するデータ
   * @param ttlMs TTL（ミリ秒）
   */
  public set<T>(key: string, data: T, ttlMs: number): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { data, expiry });
  }

  /**
   * キャッシュから値を取得
   * @param key キャッシュキー
   * @returns キャッシュされたデータ、存在しないか期限切れの場合はnull
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // 期限切れチェック
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * キャッシュから値を削除
   * @param key キャッシュキー
   * @returns 削除に成功した場合true
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * キャッシュをクリア
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * キャッシュに存在するかチェック（期限切れも考慮）
   * @param key キャッシュキー
   * @returns 存在する場合true
   */
  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * キャッシュサイズを取得
   * @returns キャッシュエントリ数
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * 期限切れエントリをクリーンアップ
   * @returns クリーンアップしたエントリ数
   */
  public cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * 自動クリーンアップを開始
   * @param intervalMs クリーンアップ間隔（ミリ秒）
   */
  private startAutoCleanup(intervalMs: number): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }

  /**
   * 自動クリーンアップを停止
   */
  public stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * キャッシュ統計情報を取得
   */
  public getStats(): {
    totalEntries: number;
    expiredEntries: number;
    validEntries: number;
  } {
    const now = Date.now();
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiry) {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries,
      validEntries: this.cache.size - expiredEntries,
    };
  }

  /**
   * キャッシュキーを生成するヘルパーメソッド
   * @param prefix プレフィックス
   * @param params パラメータ
   * @returns キャッシュキー
   */
  public static generateKey(prefix: string, ...params: string[]): string {
    return `${prefix}:${params.join(":")}`;
  }
}
