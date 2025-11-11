/**
 * InputValidator - 単体テスト
 *
 * InputValidatorクラスの各機能をテスト
 */

import { describe, it, expect, beforeEach } from "vitest";
import { InputValidator } from "../../src/validators/inputValidator";

describe("InputValidator", () => {
  let validator: InputValidator;

  beforeEach(() => {
    validator = new InputValidator();
  });

  describe("正常系テスト", () => {
    it("UT-001: 正常なUE5テーマを受け入れる", () => {
      const result = validator.validate(
        "UE5のコントロールリグを使った自作アニメーション"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("正常なUE5.6テーマを受け入れる", () => {
      const result = validator.validate(
        "Unreal Engine 5.6で必殺技演出を作成する"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("日本語のUE5テーマを受け入れる", () => {
      const result = validator.validate(
        "UE5.6のブループリントでキャラクターアニメーション"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("英語のUE5テーマを受け入れる", () => {
      const result = validator.validate(
        "Creating character animations with Unreal Engine 5.6 Blueprint"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("異常系テスト", () => {
    it("UT-002: 空文字列を拒否する", () => {
      const result = validator.validate("");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("テーマが入力されていません");
    });

    it("空白文字のみを拒否する", () => {
      const result = validator.validate("   ");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("テーマが入力されていません");
    });

    it("UT-003: 1000文字を超える入力を拒否する", () => {
      const longTheme = "a".repeat(1001);
      const result = validator.validate(longTheme);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "テーマは1000文字以内で入力してください"
      );
    });

    it("1000文字ちょうどは受け入れる", () => {
      const maxTheme = "UE5 " + "a".repeat(996);
      const result = validator.validate(maxTheme);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("警告テスト", () => {
    it("UT-004: UE5に関連しない入力に警告を出す", () => {
      const result = validator.validate("Pythonでデータ分析する方法");

      expect(result.isValid).toBe(true); // 拒否はしないが警告
      expect(result.warnings).toContain(
        "このテーマはUE5に関連していない可能性があります"
      );
    });

    it("古いバージョンの指定に警告を出す", () => {
      const result = validator.validate(
        "UE5.3でコントロールリグを使う方法"
      );

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(
        result.warnings.some((w) => w.includes("古いバージョン"))
      ).toBe(true);
    });

    it("UE4の指定に警告を出す", () => {
      const result = validator.validate("UE4でアニメーションを作る");

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe("セキュリティテスト", () => {
    it("XSS攻撃パターンを検出する", () => {
      const result = validator.validate(
        '<script>alert("xss")</script> UE5 animation'
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("入力に不正な文字列が含まれています");
    });

    it("JavaScriptプロトコルを検出する", () => {
      const result = validator.validate("javascript:alert(1) UE5");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("入力に不正な文字列が含まれています");
    });

    it("イベントハンドラを検出する", () => {
      const result = validator.validate('onclick="alert(1)" UE5');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("入力に不正な文字列が含まれています");
    });

    it("パストラバーサルを検出する", () => {
      const result = validator.validate("../../etc/passwd UE5");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("入力に不正な文字列が含まれています");
    });
  });

  describe("UE5関連性チェック", () => {
    it("UE5キーワードを含むテーマを認識する", () => {
      const themes = [
        "Unreal Engine 5でゲーム開発",
        "UE5.6のNiagara VFX",
        "ブループリントでキャラクター制御",
        "コントロールリグの使い方",
        "アニメーションブループリント",
        "Naniteとルーメンの活用",
      ];

      themes.forEach((theme) => {
        const result = validator.validate(theme);
        expect(result.warnings).not.toContain(
          "このテーマはUE5に関連していない可能性があります"
        );
      });
    });

    it("UE5に関連しないテーマを検出する", () => {
      const themes = [
        "Pythonでデータ分析",
        "Reactでフロントエンド開発",
        "機械学習の基礎",
        "Dockerコンテナの使い方",
      ];

      themes.forEach((theme) => {
        const result = validator.validate(theme);
        expect(result.warnings).toContain(
          "このテーマはUE5に関連していない可能性があります"
        );
      });
    });
  });

  describe("サニタイズ機能", () => {
    it("テーマをサニタイズする", () => {
      const theme = "  UE5でアニメーション  ";
      const sanitized = validator.sanitizeTheme(theme);

      expect(sanitized).toBe("UE5でアニメーション");
    });

    it("HTMLタグを除去する", () => {
      const theme = "UE5で<b>アニメーション</b>を作る";
      const sanitized = validator.sanitizeTheme(theme);

      expect(sanitized).not.toContain("<b>");
      expect(sanitized).not.toContain("</b>");
    });
  });

  describe("詳細バリデーション", () => {
    it("詳細なバリデーション情報を取得する", () => {
      const theme = "UE5.6のコントロールリグ";
      const detailed = validator.getDetailedValidation(theme);

      expect(detailed.result.isValid).toBe(true);
      expect(detailed.sanitizedTheme).toBe(theme);
      expect(detailed.length).toBeGreaterThan(0);
      expect(detailed.isUE5Related).toBe(true);
    });
  });

  describe("改善提案", () => {
    it("UE5関連でないテーマに改善提案を出す", () => {
      const theme = "データ分析の方法";
      const suggestions = validator.suggestImprovements(theme);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(
        suggestions.some((s) => s.includes("キーワードを含めると"))
      ).toBe(true);
    });

    it("短いテーマに改善提案を出す", () => {
      const theme = "UE5";
      const suggestions = validator.suggestImprovements(theme);

      expect(
        suggestions.some((s) => s.includes("詳細なテーマを入力"))
      ).toBe(true);
    });

    it("バージョン指定がないテーマに改善提案を出す", () => {
      const theme = "Unreal Engineでアニメーション";
      const suggestions = validator.suggestImprovements(theme);

      expect(
        suggestions.some((s) => s.includes("5.6"))
      ).toBe(true);
    });

    it("最適なテーマには提案が少ない", () => {
      const theme =
        "UE5.6のコントロールリグを使った自作キャラクターアニメーション";
      const suggestions = validator.suggestImprovements(theme);

      expect(suggestions.length).toBeLessThanOrEqual(1);
    });
  });

  describe("境界値テスト", () => {
    it("最小文字数（1文字）でUE5関連は通過", () => {
      const result = validator.validate("U"); // 短すぎるが、バリデーション自体は通過する可能性

      // 1文字でもエラーにはならないが、警告が出る可能性がある
      expect(result.errors).not.toContain("テーマが短すぎます");
    });

    it("999文字は通過", () => {
      const theme = "UE5 " + "a".repeat(995);
      const result = validator.validate(theme);

      expect(result.isValid).toBe(true);
    });

    it("1001文字は拒否", () => {
      const theme = "UE5 " + "a".repeat(997);
      const result = validator.validate(theme);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "テーマは1000文字以内で入力してください"
      );
    });
  });
});
