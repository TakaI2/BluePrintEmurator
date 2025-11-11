import { MAX_THEME_LENGTH } from '../config/constants.js';

/**
 * 入力のサニタイゼーション
 */
export class InputSanitizer {
  /**
   * テーマ入力をサニタイズ
   */
  sanitize(input: string): string {
    // HTMLタグを除去
    let sanitized = input.replace(/<[^>]*>/g, '');

    // スクリプトインジェクション対策
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // 制御文字を除去
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // 長さ制限
    sanitized = sanitized.slice(0, MAX_THEME_LENGTH);

    // 前後の空白を削除
    sanitized = sanitized.trim();

    return sanitized;
  }

  /**
   * ファイルパスをサニタイズ
   */
  sanitizePath(path: string): string {
    // パストラバーサル攻撃対策
    let sanitized = path.replace(/\.\./g, '');

    // 不正な文字を除去
    sanitized = sanitized.replace(/[<>:"|?*\x00-\x1F]/g, '');

    return sanitized;
  }

  /**
   * URLをサニタイズ（ホワイトリスト方式）
   */
  sanitizeUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);

      // 許可されたプロトコルのみ
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return null;
      }

      // 許可されたドメインのみ（UE5公式ドキュメント）
      const allowedDomains = [
        'docs.unrealengine.com',
        'dev.epicgames.com',
        'unrealengine.com'
      ];

      const hostname = parsedUrl.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      );

      if (!isAllowed) {
        return null;
      }

      return parsedUrl.toString();
    } catch {
      return null;
    }
  }
}
