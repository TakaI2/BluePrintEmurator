/**
 * 教案全体のデータ構造
 */
export interface LessonPlan {
  id: string;
  title: string;
  theme: string;
  targetVersion: string; // "5.6"
  createdAt: Date;
  sections: Section[];
  diagrams: Diagram[];
  references: Reference[];
}

/**
 * セクションの種類
 */
export enum SectionType {
  LEARNING_OBJECTIVES = 'learning_objectives',
  PREREQUISITES = 'prerequisites',
  FEATURES_USED = 'features_used',
  IMPLEMENTATION_STEPS = 'implementation_steps',
  BLUEPRINT_IMPLEMENTATION = 'blueprint_implementation',
  SETTINGS = 'settings',
  DIAGRAMS = 'diagrams',
  TROUBLESHOOTING = 'troubleshooting',
  ADVANCED_CHALLENGES = 'advanced_challenges',
  REFERENCES = 'references'
}

/**
 * セクション
 */
export interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  order: number;
}

/**
 * 図の種類
 */
export enum DiagramType {
  BLUEPRINT_FLOW = 'blueprint_flow',
  ANIMATION_BLUEPRINT = 'animation_blueprint',
  TIMELINE = 'timeline',
  STATE_MACHINE = 'state_machine'
}

/**
 * 図
 */
export interface Diagram {
  id: string;
  type: DiagramType;
  title: string;
  mermaidCode: string;
  description: string;
}

/**
 * 参考文献
 */
export interface Reference {
  title: string;
  url: string;
  version: string; // "5.6"
  description: string;
}

/**
 * 検索結果
 */
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  version?: string;
  relevanceScore: number;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * コンテキスト（AI生成時の情報）
 */
export interface Context {
  theme: string;
  targetVersion: string;
  sectionType?: SectionType;
  latestInfo?: SearchResult[];
  themeTemplate?: ThemeTemplate;
}

/**
 * テーマテンプレート
 */
export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  targetVersion: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  keywords: string[];
  prerequisiteTopics: string[];
  learningObjectives: string[];
  diagramTemplates: DiagramTemplateInfo[];
}

/**
 * 図テンプレート情報
 */
export interface DiagramTemplateInfo {
  type: DiagramType;
  description: string;
}

/**
 * ノード（Mermaid図用）
 */
export interface Node {
  id: string;
  label: string;
  type: NodeType;
}

/**
 * ノードの種類
 */
export enum NodeType {
  EVENT = 'event',
  CONDITION = 'condition',
  ACTION = 'action',
  FUNCTION = 'function'
}

/**
 * 接続（Mermaid図用）
 */
export interface Connection {
  from: string;
  to: string;
  label?: string;
}

/**
 * タイムライン
 */
export interface Timeline {
  events: TimelineEvent[];
}

/**
 * タイムラインイベント
 */
export interface TimelineEvent {
  time: number;
  action: string;
}
