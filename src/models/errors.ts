/**
 * エラーの種類
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  SEARCH_SERVICE_ERROR = 'SEARCH_SERVICE_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  OUTPUT_ERROR = 'OUTPUT_ERROR'
}

/**
 * アプリケーションエラー
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';

    // TypeScriptのエラー継承のためのおまじない
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * エラーを文字列に変換
   */
  toString(): string {
    return `[${this.type}] ${this.message}${this.details ? `: ${JSON.stringify(this.details)}` : ''}`;
  }
}
