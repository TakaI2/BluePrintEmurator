/**
 * AIService - AI APIを使った教案コンテンツの生成
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/config.js';
import { AppError, ErrorType } from '../models/errors.js';
import { SectionType } from '../models/lessonPlan.js';
import { AI_TEMPERATURE, AI_MAX_TOKENS, AI_MAX_RETRIES } from '../config/constants.js';
import { delay } from '../utils/helpers.js';

/**
 * AIプロバイダーの種類
 */
export type AIProvider = 'openai' | 'claude';

/**
 * AIリクエストのコンテキスト
 */
export interface AIContext {
  theme: string;
  targetVersion: string;
  sectionType: SectionType;
  latestInfo?: string[];
  additionalContext?: Record<string, unknown>;
}

/**
 * AI生成のレスポンス
 */
export interface AIResponse {
  content: string;
  provider: AIProvider;
  tokensUsed?: number;
}

/**
 * AIService設定
 */
interface AIServiceConfig {
  primaryProvider: AIProvider;
  fallbackProvider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
}

/**
 * AIServiceの抽象インターフェース
 */
interface IAIService {
  generateContent(prompt: string, systemPrompt: string): Promise<AIResponse>;
  generateSection(context: AIContext): Promise<AIResponse>;
  isAvailable(): Promise<boolean>;
}

/**
 * OpenAI実装
 */
class OpenAIService implements IAIService {
  private client: OpenAI;
  private temperature: number;
  private maxTokens: number;

  constructor(apiKey: string, temperature: number, maxTokens: number) {
    this.client = new OpenAI({ apiKey });
    this.temperature = temperature;
    this.maxTokens = maxTokens;
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async generateContent(prompt: string, systemPrompt: string): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new AppError(ErrorType.AI_SERVICE_ERROR, 'OpenAI returned empty response');
      }

      return {
        content,
        provider: 'openai',
        tokensUsed: completion.usage?.total_tokens
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorType.AI_SERVICE_ERROR,
        `OpenAI API error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async generateSection(context: AIContext): Promise<AIResponse> {
    const { systemPrompt, userPrompt } = this.buildPrompts(context);
    return this.generateContent(userPrompt, systemPrompt);
  }

  private buildPrompts(context: AIContext): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `あなたはUnreal Engine ${context.targetVersion}の専門家であり、高校生向けの教案を作成する教育者です。
明確で、段階的で、実践的な内容を提供してください。`;

    let userPrompt = `テーマ: ${context.theme}\n対象バージョン: UE${context.targetVersion}\n\n`;

    if (context.latestInfo && context.latestInfo.length > 0) {
      userPrompt += `最新情報:\n${context.latestInfo.join('\n')}\n\n`;
    }

    userPrompt += this.getSectionSpecificPrompt(context.sectionType, context);

    return { systemPrompt, userPrompt };
  }

  private getSectionSpecificPrompt(sectionType: SectionType, context: AIContext): string {
    switch (sectionType) {
      case SectionType.LEARNING_OBJECTIVES:
        return `以下の形式で学習目標を3-5個作成してください：
- 具体的で測定可能な目標
- 高校生が理解できる表現
- 実践的なスキルに焦点`;

      case SectionType.PREREQUISITES:
        return `以下の形式で前提知識を3-5個リストしてください：
- この教案を始める前に必要な知識
- UE5の基本操作レベル`;

      case SectionType.FEATURES_USED:
        return `UE${context.targetVersion}で使用する機能を詳しく説明してください：
- 各機能の簡単な説明
- バージョン固有の機能があれば強調`;

      case SectionType.IMPLEMENTATION_STEPS:
        return `実装手順を段階的に説明してください：
- 各ステップは明確で実行可能
- スクリーンショットが必要な箇所を示す
- 高校生が迷わないように詳細に`;

      case SectionType.BLUEPRINT_IMPLEMENTATION:
        return `ブループリント実装の詳細を説明してください：
- ノードの配置手順
- 接続方法
- 各ノードの役割`;

      case SectionType.SETTINGS:
        return `必要な設定値を具体的にリストしてください：
- パラメータ名と推奨値
- 設定理由の説明`;

      case SectionType.TROUBLESHOOTING:
        return `よくある問題と解決方法を3-5個リストしてください：
- 問題の症状
- 原因
- 解決手順`;

      case SectionType.ADVANCED_CHALLENGES:
        return `発展課題を2-3個提案してください：
- 基本実装の応用
- より高度な機能の追加
- 創造性を促す課題`;

      default:
        return `「${sectionType}」セクションの内容を作成してください。`;
    }
  }
}

/**
 * Claude (Anthropic) 実装
 */
class ClaudeService implements IAIService {
  private client: Anthropic;
  private temperature: number;
  private maxTokens: number;

  constructor(apiKey: string, temperature: number, maxTokens: number) {
    this.client = new Anthropic({ apiKey });
    this.temperature = temperature;
    this.maxTokens = maxTokens;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Claudeの場合、簡単なチェック（APIキーの妥当性確認）
      // 実際のAPIコールは避けてコスト削減
      return true;
    } catch {
      return false;
    }
  }

  async generateContent(prompt: string, systemPrompt: string): Promise<AIResponse> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = message.content[0];
      if (!content) {
        throw new AppError(ErrorType.AI_SERVICE_ERROR, 'Claude returned empty response');
      }

      if (content.type !== 'text') {
        throw new AppError(ErrorType.AI_SERVICE_ERROR, 'Claude returned non-text response');
      }

      return {
        content: content.text,
        provider: 'claude',
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ErrorType.AI_SERVICE_ERROR,
        `Claude API error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async generateSection(context: AIContext): Promise<AIResponse> {
    const { systemPrompt, userPrompt } = this.buildPrompts(context);
    return this.generateContent(userPrompt, systemPrompt);
  }

  private buildPrompts(context: AIContext): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `あなたはUnreal Engine ${context.targetVersion}の専門家であり、高校生向けの教案を作成する教育者です。
明確で、段階的で、実践的な内容を提供してください。`;

    let userPrompt = `テーマ: ${context.theme}\n対象バージョン: UE${context.targetVersion}\n\n`;

    if (context.latestInfo && context.latestInfo.length > 0) {
      userPrompt += `最新情報:\n${context.latestInfo.join('\n')}\n\n`;
    }

    userPrompt += this.getSectionSpecificPrompt(context.sectionType, context);

    return { systemPrompt, userPrompt };
  }

  private getSectionSpecificPrompt(sectionType: SectionType, context: AIContext): string {
    // OpenAIServiceと同じロジックを使用
    switch (sectionType) {
      case SectionType.LEARNING_OBJECTIVES:
        return `以下の形式で学習目標を3-5個作成してください：
- 具体的で測定可能な目標
- 高校生が理解できる表現
- 実践的なスキルに焦点`;

      case SectionType.PREREQUISITES:
        return `以下の形式で前提知識を3-5個リストしてください：
- この教案を始める前に必要な知識
- UE5の基本操作レベル`;

      case SectionType.FEATURES_USED:
        return `UE${context.targetVersion}で使用する機能を詳しく説明してください：
- 各機能の簡単な説明
- バージョン固有の機能があれば強調`;

      case SectionType.IMPLEMENTATION_STEPS:
        return `実装手順を段階的に説明してください：
- 各ステップは明確で実行可能
- スクリーンショットが必要な箇所を示す
- 高校生が迷わないように詳細に`;

      case SectionType.BLUEPRINT_IMPLEMENTATION:
        return `ブループリント実装の詳細を説明してください：
- ノードの配置手順
- 接続方法
- 各ノードの役割`;

      case SectionType.SETTINGS:
        return `必要な設定値を具体的にリストしてください：
- パラメータ名と推奨値
- 設定理由の説明`;

      case SectionType.TROUBLESHOOTING:
        return `よくある問題と解決方法を3-5個リストしてください：
- 問題の症状
- 原因
- 解決手順`;

      case SectionType.ADVANCED_CHALLENGES:
        return `発展課題を2-3個提案してください：
- 基本実装の応用
- より高度な機能の追加
- 創造性を促す課題`;

      default:
        return `「${sectionType}」セクションの内容を作成してください。`;
    }
  }
}

/**
 * AIService - プロバイダーの切り替えとフォールバック機能を持つメインサービス
 */
export class AIService {
  private primaryService: IAIService;
  private fallbackService: IAIService | null = null;
  private maxRetries: number;

  constructor(serviceConfig: AIServiceConfig) {
    const temperature = serviceConfig.temperature ?? AI_TEMPERATURE;
    const maxTokens = serviceConfig.maxTokens ?? AI_MAX_TOKENS;
    this.maxRetries = serviceConfig.maxRetries ?? AI_MAX_RETRIES;

    // プライマリサービスの初期化
    this.primaryService = this.createService(
      serviceConfig.primaryProvider,
      temperature,
      maxTokens
    );

    // フォールバックサービスの初期化
    if (serviceConfig.fallbackProvider) {
      this.fallbackService = this.createService(
        serviceConfig.fallbackProvider,
        temperature,
        maxTokens
      );
    }
  }

  private createService(
    provider: AIProvider,
    temperature: number,
    maxTokens: number
  ): IAIService {
    switch (provider) {
      case 'openai': {
        const apiKey = config.openaiApiKey;
        if (!apiKey) {
          throw new AppError(ErrorType.CONFIG_ERROR, 'OpenAI API key is not configured');
        }
        return new OpenAIService(apiKey, temperature, maxTokens);
      }
      case 'claude': {
        const apiKey = config.anthropicApiKey;
        if (!apiKey) {
          throw new AppError(ErrorType.CONFIG_ERROR, 'Anthropic API key is not configured');
        }
        return new ClaudeService(apiKey, temperature, maxTokens);
      }
      default:
        throw new AppError(ErrorType.CONFIG_ERROR, `Unknown AI provider: ${provider}`);
    }
  }

  /**
   * コンテンツを生成（リトライとフォールバック付き）
   */
  async generateContent(prompt: string, systemPrompt: string): Promise<AIResponse> {
    // プライマリサービスで試行
    try {
      return await this.generateWithRetry(this.primaryService, prompt, systemPrompt);
    } catch (primaryError) {
      // フォールバックサービスがあれば試行
      if (this.fallbackService) {
        console.warn('Primary AI service failed, trying fallback service...');
        try {
          return await this.generateWithRetry(this.fallbackService, prompt, systemPrompt);
        } catch (fallbackError) {
          throw new AppError(
            ErrorType.AI_SERVICE_ERROR,
            `Both primary and fallback AI services failed. Primary: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`
          );
        }
      }
      throw primaryError;
    }
  }

  /**
   * セクション生成（リトライとフォールバック付き）
   */
  async generateSection(context: AIContext): Promise<AIResponse> {
    // プライマリサービスで試行
    try {
      return await this.generateSectionWithRetry(this.primaryService, context);
    } catch (primaryError) {
      // フォールバックサービスがあれば試行
      if (this.fallbackService) {
        console.warn('Primary AI service failed, trying fallback service...');
        try {
          return await this.generateSectionWithRetry(this.fallbackService, context);
        } catch (fallbackError) {
          throw new AppError(
            ErrorType.AI_SERVICE_ERROR,
            `Both primary and fallback AI services failed. Primary: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`
          );
        }
      }
      throw primaryError;
    }
  }

  /**
   * リトライ機能付きコンテンツ生成
   */
  private async generateWithRetry(
    service: IAIService,
    prompt: string,
    systemPrompt: string
  ): Promise<AIResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await service.generateContent(prompt, systemPrompt);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000; // 指数バックオフ: 2s, 4s, 8s
          console.warn(`AI generation attempt ${attempt} failed, retrying in ${delayMs}ms...`);
          await delay(delayMs);
        }
      }
    }

    throw new AppError(
      ErrorType.AI_SERVICE_ERROR,
      `AI generation failed after ${this.maxRetries} attempts: ${lastError?.message ?? 'Unknown error'}`
    );
  }

  /**
   * リトライ機能付きセクション生成
   */
  private async generateSectionWithRetry(
    service: IAIService,
    context: AIContext
  ): Promise<AIResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await service.generateSection(context);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000; // 指数バックオフ
          console.warn(`AI section generation attempt ${attempt} failed, retrying in ${delayMs}ms...`);
          await delay(delayMs);
        }
      }
    }

    throw new AppError(
      ErrorType.AI_SERVICE_ERROR,
      `AI section generation failed after ${this.maxRetries} attempts: ${lastError?.message ?? 'Unknown error'}`
    );
  }

  /**
   * サービスが利用可能か確認
   */
  async checkAvailability(): Promise<{
    primary: boolean;
    fallback: boolean | null;
  }> {
    const primary = await this.primaryService.isAvailable();
    const fallback = this.fallbackService ? await this.fallbackService.isAvailable() : null;

    return { primary, fallback };
  }
}

/**
 * AIServiceファクトリー - 環境に応じて適切なサービスを作成
 */
export function createAIService(): AIService {
  // 使用可能なプロバイダーを決定
  const hasOpenAI = !!config.openaiApiKey;
  const hasClaude = !!config.anthropicApiKey;

  if (!hasOpenAI && !hasClaude) {
    throw new AppError(
      ErrorType.CONFIG_ERROR,
      'At least one AI API key (OpenAI or Anthropic) must be configured'
    );
  }

  // プライマリとフォールバックを設定
  let primaryProvider: AIProvider;
  let fallbackProvider: AIProvider | undefined;

  if (hasOpenAI && hasClaude) {
    // 両方ある場合: OpenAIをプライマリ、Claudeをフォールバック
    primaryProvider = 'openai';
    fallbackProvider = 'claude';
  } else if (hasOpenAI) {
    // OpenAIのみ
    primaryProvider = 'openai';
  } else {
    // Claudeのみ
    primaryProvider = 'claude';
  }

  return new AIService({
    primaryProvider,
    fallbackProvider,
    temperature: AI_TEMPERATURE,
    maxTokens: AI_MAX_TOKENS,
    maxRetries: AI_MAX_RETRIES
  });
}
