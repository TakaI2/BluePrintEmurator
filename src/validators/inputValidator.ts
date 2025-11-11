/**
 * InputValidator - 入力バリデーション
 *
 * ユーザーから入力されたテーマのバリデーションを行う。
 * UE5.6関連性チェック、文字数制限、サニタイゼーションなどを実施。
 */

import type { ValidationResult } from "../models/lessonPlan";
import { InputSanitizer } from "../utils/inputSanitizer";

/**
 * InputValidator - 入力検証クラス
 */
export class InputValidator {
  private sanitizer: InputSanitizer;
  private readonly MAX_LENGTH = 1000;
  private readonly MIN_LENGTH = 1;

  // UE5関連キーワード（大文字小文字を区別しない）
  private readonly UE5_KEYWORDS = [
    "unreal",
    "ue5",
    "ue 5",
    "ue5.6",
    "unreal engine",
    "blueprint",
    "ブループリント",
    "animation",
    "アニメーション",
    "control rig",
    "コントロールリグ",
    "niagara",
    "ナイアガラ",
    "sequencer",
    "シーケンサー",
    "widget",
    "ウィジェット",
    "material",
    "マテリアル",
    "particle",
    "パーティクル",
    "nanite",
    "ナナイト",
    "lumen",
    "ルーメン",
    "chaos",
    "カオス",
    "metahuman",
    "メタヒューマン",
    "pcg",
    "landscape",
    "ランドスケープ",
    "level",
    "レベル",
    "actor",
    "アクタ",
    "component",
    "コンポーネント",
  ];

  constructor() {
    this.sanitizer = new InputSanitizer();
  }

  /**
   * テーマ入力をバリデーション
   * @param theme ユーザー入力のテーマ
   * @returns バリデーション結果
   */
  public validate(theme: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. 基本的な検証
    if (!theme || theme.trim().length === 0) {
      errors.push("テーマが入力されていません");
      return { isValid: false, errors, warnings };
    }

    // 2. 危険なパターンチェック（サニタイズ前）
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick=, onload= など
      /\.\.\//g, // パストラバーサル
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(theme)) {
        errors.push("入力に不正な文字列が含まれています");
        break;
      }
    }

    // 3. 文字数チェック（サニタイズ前の文字数で判定）
    const trimmed = theme.trim();
    if (trimmed.length < this.MIN_LENGTH) {
      errors.push("テーマが短すぎます");
    }

    if (trimmed.length > this.MAX_LENGTH) {
      errors.push("テーマは1000文字以内で入力してください");
    }

    // 4. サニタイズ
    const sanitized = this.sanitizer.sanitize(theme);

    // 5. UE5関連性チェック
    if (!this.isUE5Related(sanitized)) {
      warnings.push("このテーマはUE5に関連していない可能性があります");
    }

    // 6. バージョン情報の混入チェック
    const oldVersionPattern = /UE\s*[1-4]|5\.[0-5]|Unreal\s+Engine\s+[1-4]/i;
    if (oldVersionPattern.test(sanitized)) {
      warnings.push(
        "古いバージョン（UE5.5以前）が指定されている可能性があります。UE5.6の内容で生成します。"
      );
    }

    // バリデーション結果
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * UE5に関連しているかチェック
   * @param theme テーマ文字列
   * @returns UE5関連の場合true
   */
  private isUE5Related(theme: string): boolean {
    const lowerTheme = theme.toLowerCase();

    // キーワードマッチング
    return this.UE5_KEYWORDS.some((keyword) => lowerTheme.includes(keyword));
  }

  /**
   * テーマをサニタイズして返す
   * @param theme 入力テーマ
   * @returns サニタイズされたテーマ
   */
  public sanitizeTheme(theme: string): string {
    return this.sanitizer.sanitize(theme);
  }

  /**
   * 詳細なバリデーション情報を取得
   * @param theme 入力テーマ
   * @returns 詳細バリデーション情報
   */
  public getDetailedValidation(theme: string): {
    result: ValidationResult;
    sanitizedTheme: string;
    length: number;
    isUE5Related: boolean;
  } {
    const sanitized = this.sanitizeTheme(theme);
    const result = this.validate(theme);

    return {
      result,
      sanitizedTheme: sanitized,
      length: sanitized.length,
      isUE5Related: this.isUE5Related(sanitized),
    };
  }

  /**
   * テーマの推奨形式を提案
   * @param theme 入力テーマ
   * @returns 改善提案
   */
  public suggestImprovements(theme: string): string[] {
    const suggestions: string[] = [];
    const sanitized = this.sanitizeTheme(theme);

    // UE5関連でない場合
    if (!this.isUE5Related(sanitized)) {
      suggestions.push(
        "テーマに「UE5」「Unreal Engine」「ブループリント」などのキーワードを含めると、より適切な教案が生成されます"
      );
    }

    // 短すぎる場合
    if (sanitized.length < 10) {
      suggestions.push(
        "より詳細なテーマを入力すると、具体的な教案が生成されます"
      );
    }

    // バージョン指定がない場合
    if (!sanitized.toLowerCase().includes("5.6")) {
      suggestions.push(
        "「UE5.6」と明示的にバージョンを指定すると、最新機能に特化した教案が生成されます"
      );
    }

    return suggestions;
  }
}
