/**
 * 定数定義
 */

// アプリケーション情報
export const APP_NAME = 'BlueprintEmulator';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'UE5.6教案自動生成システム - Unreal Engine 5.6 Lesson Plan Generator';

// Unreal Engineバージョン
export const TARGET_UE_VERSION = '5.6';
export const UE_VERSION_PATTERN = /5\.6/;
export const OLD_VERSION_PATTERN = /5\.[0-5]|UE4/;

// タイムアウト設定（ミリ秒）
export const DEFAULT_TIMEOUT_MS = 30000; // 30秒
export const AI_GENERATION_TIMEOUT_MS = 30000; // 30秒
export const SEARCH_TIMEOUT_MS = 10000; // 10秒
export const HTML_OUTPUT_TIMEOUT_MS = 10000; // 10秒

// キャッシュ設定
export const CACHE_TTL_MS = 3600000; // 1時間

// AI設定
export const AI_TEMPERATURE = 0.7;
export const AI_MAX_TOKENS = 3000;
export const AI_MAX_RETRIES = 3;

// 検索設定
export const SEARCH_QUERY_TEMPLATE = '"Unreal Engine 5.6" OR "UE5.6" {query} -"5.5" -"5.4" -"5.3" -"5.2" -"5.1" -"5.0" -"UE4"';
export const MAX_SEARCH_RESULTS = 10;

// 入力バリデーション
export const MAX_THEME_LENGTH = 1000;
export const MIN_THEME_LENGTH = 5;

// セクションタイトル
export const SECTION_TITLES: Record<string, string> = {
  learning_objectives: '学習目標',
  prerequisites: '前提知識',
  features_used: '使用する機能',
  implementation_steps: '実装手順',
  blueprint_implementation: 'ブループリント実装',
  settings: '設定値',
  diagrams: '図解',
  troubleshooting: 'トラブルシューティング',
  advanced_challenges: '発展課題',
  references: '参考文献'
};

// 図の種類タイトル
export const DIAGRAM_TITLES: Record<string, string> = {
  blueprint_flow: 'ブループリントフロー図',
  animation_blueprint: 'アニメーションブループリント図',
  timeline: 'タイムライン図',
  state_machine: 'ステートマシン図'
};

// Mermaid.js CDN
export const MERMAID_CDN_URL = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';

// 出力設定
export const DEFAULT_OUTPUT_DIR = './output';
export const OUTPUT_FILE_PREFIX = 'lesson-plan';
export const OUTPUT_FILE_EXTENSION = '.html';
