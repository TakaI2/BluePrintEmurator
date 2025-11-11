/**
 * PromptBuilder - AIプロンプトテンプレート構築
 *
 * セクション別のAIプロンプトを生成するユーティリティクラス。
 * UE5.6に特化した教案生成のためのプロンプトテンプレートを提供。
 */

import type {
  SectionType,
  SearchResult,
  ThemeTemplate,
} from "../models/lessonPlan";

/**
 * プロンプトテンプレート
 */
export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * プロンプト生成用のコンテキスト
 */
export interface PromptContext {
  theme: string;
  targetVersion: string;
  sectionType: SectionType;
  latestInfo: SearchResult[];
  themeTemplate?: ThemeTemplate;
  blueprintImplementation?: string;
}

/**
 * セクション別のシステムプロンプト定義
 */
const SYSTEM_PROMPTS: Record<SectionType, string> = {
  learning_objectives: `あなたはUnreal Engine 5.6の専門家であり、高校生向けの教案を作成する教育者です。
明確で、段階的で、実践的な学習目標を提示してください。`,

  prerequisites: `あなたはUnreal Engine 5.6の専門家であり、カリキュラム設計の経験豊富な教育者です。
学習者が事前に理解しておくべき知識やスキルを明確に示してください。`,

  features_used: `あなたはUnreal Engine 5.6の機能に精通した技術専門家です。
このテーマで使用するUE5.6の機能を、わかりやすく説明してください。`,

  implementation_steps: `あなたはUnreal Engine 5.6の実装専門家です。
高校生が実際に実装できる、具体的で詳細な手順を提供してください。`,

  blueprint_implementation: `あなたはUnreal Engine 5.6のブループリント専門家です。
高校生が実際に実装できる、具体的で詳細なブループリント手順を提供してください。`,

  settings: `あなたはUnreal Engine 5.6の設定とパラメータ調整の専門家です。
最適な動作を実現するための設定値を、理由とともに提供してください。`,

  diagrams: `あなたはUnreal Engine 5.6のブループリント構造を視覚化する専門家です。
Mermaid.js形式でブループリントのフローチャートを作成してください。`,

  troubleshooting: `あなたはUnreal Engine 5.6のトラブルシューティング専門家です。
よくある問題とその解決方法を、わかりやすく説明してください。`,

  advanced_challenges: `あなたはUnreal Engine 5.6の上級テクニックに精通した専門家です。
学習者が次のステップとして挑戦できる、発展的な課題を提供してください。`,

  references: `あなたはUnreal Engine 5.6の公式ドキュメントに精通した専門家です。
学習者が参照すべき公式リソースを、適切に選定してください。`,
};

/**
 * PromptBuilder - AIプロンプト構築クラス
 */
export class PromptBuilder {
  /**
   * セクション別プロンプトを生成
   */
  public buildPrompt(context: PromptContext): PromptTemplate {
    const systemPrompt = this.getSystemPrompt(context.sectionType);
    const userPrompt = this.buildUserPrompt(context);

    return {
      systemPrompt,
      userPrompt,
    };
  }

  /**
   * システムプロンプトを取得
   */
  private getSystemPrompt(sectionType: SectionType): string {
    return SYSTEM_PROMPTS[sectionType];
  }

  /**
   * ユーザープロンプトを構築
   */
  private buildUserPrompt(context: PromptContext): string {
    switch (context.sectionType) {
      case "learning_objectives":
        return this.buildLearningObjectivesPrompt(context);
      case "prerequisites":
        return this.buildPrerequisitesPrompt(context);
      case "features_used":
        return this.buildFeaturesUsedPrompt(context);
      case "implementation_steps":
        return this.buildImplementationStepsPrompt(context);
      case "blueprint_implementation":
        return this.buildBlueprintImplementationPrompt(context);
      case "settings":
        return this.buildSettingsPrompt(context);
      case "diagrams":
        return this.buildDiagramsPrompt(context);
      case "troubleshooting":
        return this.buildTroubleshootingPrompt(context);
      case "advanced_challenges":
        return this.buildAdvancedChallengesPrompt(context);
      case "references":
        return this.buildReferencesPrompt(context);
      default:
        throw new Error(`Unknown section type: ${context.sectionType}`);
    }
  }

  /**
   * 学習目標プロンプトを構築
   */
  private buildLearningObjectivesPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);
    const templateInfo = context.themeTemplate
      ? this.formatTemplateInfo(context.themeTemplate)
      : "";

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

${templateInfo}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマの学習目標を3-5個、箇条書きで作成してください。
各目標は具体的で測定可能であり、高校生が理解できる言葉で記述してください。
古いバージョン（UE5.5以前）の情報は使用しないでください。`;
  }

  /**
   * 前提知識プロンプトを構築
   */
  private buildPrerequisitesPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);
    const templateInfo = context.themeTemplate
      ? this.formatTemplateInfo(context.themeTemplate)
      : "";

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

${templateInfo}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマを学習する前に必要な前提知識やスキルを、3-5個、箇条書きで作成してください。
高校生のレベルに合わせた内容にしてください。`;
  }

  /**
   * 使用機能プロンプトを構築
   */
  private buildFeaturesUsedPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマで使用する${context.targetVersion}の主要機能を3-5個、箇条書きで説明してください。
各機能について、以下の情報を含めてください:
- 機能名
- 簡単な説明
- このテーマでの使用目的

UE5.6で推奨される最新の機能を優先してください。`;
  }

  /**
   * 実装手順プロンプトを構築
   */
  private buildImplementationStepsPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマを実装するための詳細な手順を作成してください:

1. プロジェクトのセットアップ
2. アセットの準備
3. 実装手順（ステップバイステップ）
4. テストと確認

各ステップは高校生が実際に実行できる具体的な内容にしてください。
UE5.6の最新機能を活用した実装方法を推奨してください。`;
  }

  /**
   * ブループリント実装プロンプトを構築
   */
  private buildBlueprintImplementationPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマを実現するためのブループリント実装手順を作成してください:

1. 必要なブループリントクラスの作成
2. 各ノードの配置と接続（具体的なノード名を記載）
3. 変数や関数の設定
4. 実装のポイントと注意点

UE5.6で推奨される最新の手法を使用してください。
非推奨の機能がある場合は、代替手段を明記してください。
高校生が理解できるよう、各ステップを詳しく説明してください。`;
  }

  /**
   * 設定プロンプトを構築
   */
  private buildSettingsPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマの実装に必要な設定項目を説明してください:

1. 推奨される設定値
2. 各設定の意味と効果
3. 初心者向けの最適な設定
4. パフォーマンスへの影響

UE5.6の最新の設定項目を含めてください。`;
  }

  /**
   * 図解プロンプトを構築
   */
  private buildDiagramsPrompt(context: PromptContext): string {
    if (!context.blueprintImplementation) {
      throw new Error(
        "Blueprint implementation is required for diagrams prompt"
      );
    }

    return `テーマ: ${context.theme}
ブループリント実装:
${context.blueprintImplementation}

以下のブループリント実装をMermaid.js形式のフローチャートで表現してください:

要件:
- graph LR形式を使用
- ノード名は日本語でわかりやすく
- 接続線には条件分岐がある場合、ラベルを付ける
- 高校生が理解しやすいシンプルな構造
- 重要なノードとフローに焦点を当てる

例:
graph LR
    A[入力イベント] --> B{条件分岐}
    B -->|True| C[アニメーション再生]
    B -->|False| D[何もしない]
    C --> E[エフェクト発生]

上記の例を参考に、実装に基づいたフローチャートのMermaid.jsコードのみを出力してください。
説明文は不要です。`;
  }

  /**
   * トラブルシューティングプロンプトを構築
   */
  private buildTroubleshootingPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマの実装でよく発生する問題と解決方法を3-5個、説明してください。

各問題について:
1. 問題の説明
2. 原因
3. 解決方法
4. 予防策

高校生が遭遇しやすい問題を優先してください。`;
  }

  /**
   * 発展課題プロンプトを構築
   */
  private buildAdvancedChallengesPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の最新情報を参考にしてください:
${latestInfoText}

このテーマの基本実装を終えた学習者向けの発展課題を3-5個、提案してください。

各課題について:
1. 課題の内容
2. 難易度（中級/上級）
3. 学習できる内容
4. ヒント

UE5.6の高度な機能を活用した課題を含めてください。`;
  }

  /**
   * 参考文献プロンプトを構築
   */
  private buildReferencesPrompt(context: PromptContext): string {
    const latestInfoText = this.formatLatestInfo(context.latestInfo);

    return `テーマ: ${context.theme}
対象バージョン: ${context.targetVersion}

以下の検索結果から、学習者が参照すべき公式リソースを選定してください:
${latestInfoText}

以下の形式で3-5個の参考文献を提供してください:
- タイトル
- URL
- バージョン（5.6）
- 説明（このリソースが役立つ理由）

UE5.6の公式ドキュメントを優先してください。`;
  }

  /**
   * 最新情報をフォーマット
   */
  private formatLatestInfo(searchResults: SearchResult[]): string {
    if (searchResults.length === 0) {
      return "（検索結果なし）";
    }

    return searchResults
      .map(
        (result, index) =>
          `${index + 1}. ${result.title}
   URL: ${result.url}
   概要: ${result.snippet}
   バージョン: ${result.version || "不明"}
   関連度: ${result.relevanceScore}`
      )
      .join("\n\n");
  }

  /**
   * テーマテンプレート情報をフォーマット
   */
  private formatTemplateInfo(template: ThemeTemplate): string {
    return `テーマ詳細:
- 名前: ${template.name}
- 説明: ${template.description}
- 難易度: ${template.difficulty}
- 予想時間: ${template.estimatedTime}
- キーワード: ${template.keywords.join(", ")}
- 前提トピック: ${template.prerequisiteTopics.join(", ")}
- 学習目標: ${template.learningObjectives.join(", ")}`;
  }
}
