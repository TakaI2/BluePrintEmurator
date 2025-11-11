import dotenv from 'dotenv';
import { AppError, ErrorType } from '../models/errors.js';
import {
  TARGET_UE_VERSION,
  DEFAULT_TIMEOUT_MS,
  CACHE_TTL_MS,
  DEFAULT_OUTPUT_DIR
} from './constants.js';

// .envファイルを読み込み
dotenv.config();

/**
 * 設定情報
 */
export interface Config {
  // AI API Keys
  openaiApiKey?: string;
  anthropicApiKey?: string;

  // Search API Keys
  googleSearchApiKey?: string;
  googleSearchEngineId?: string;

  // Application Settings
  targetUeVersion: string;
  maxGenerationTimeMs: number;
  cacheTtlMs: number;

  // Output Settings
  outputDir: string;

  // Debug Settings
  debug: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * 環境変数から設定を読み込む
 */
function loadConfig(): Config {
  return {
    // AI API Keys
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,

    // Search API Keys
    googleSearchApiKey: process.env.GOOGLE_SEARCH_API_KEY,
    googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,

    // Application Settings
    targetUeVersion: process.env.TARGET_UE_VERSION || TARGET_UE_VERSION,
    maxGenerationTimeMs: parseInt(process.env.MAX_GENERATION_TIME_MS || '') || DEFAULT_TIMEOUT_MS,
    cacheTtlMs: parseInt(process.env.CACHE_TTL_MS || '') || CACHE_TTL_MS,

    // Output Settings
    outputDir: process.env.OUTPUT_DIR || DEFAULT_OUTPUT_DIR,

    // Debug Settings
    debug: process.env.DEBUG === 'true',
    logLevel: (process.env.LOG_LEVEL as Config['logLevel']) || 'info'
  };
}

/**
 * 設定を検証
 */
function validateConfig(config: Config, strict = false): void {
  // Strictモードの場合のみAI APIキーをチェック
  if (strict && !config.openaiApiKey && !config.anthropicApiKey) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      'AI APIキーが設定されていません。OPENAI_API_KEYまたはANTHROPIC_API_KEYを設定してください。'
    );
  }

  // タイムアウト値が妥当か確認
  if (config.maxGenerationTimeMs < 1000 || config.maxGenerationTimeMs > 600000) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      'MAX_GENERATION_TIME_MSは1000～600000の範囲で設定してください。'
    );
  }
}

// 設定をロード
const config = loadConfig();

// 設定を検証（アプリ起動時に実行）
// 開発中はstrictモードをオフにして、APIキー未設定でも起動できるようにする
try {
  validateConfig(config, false); // strict = false
} catch (error) {
  if (error instanceof AppError) {
    console.error(`設定エラー: ${error.message}`);
    console.error('詳細は .env.example を参照してください。');
    process.exit(1);
  }
  throw error;
}

// 設定をエクスポート
export { config };

/**
 * 設定を取得（テスト用）
 */
export function getConfig(): Config {
  return config;
}
