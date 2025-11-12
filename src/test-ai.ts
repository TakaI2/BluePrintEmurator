/**
 * AIService動作確認スクリプト
 */

import { createAIService } from './services/aiService.js';
import { SectionType } from './models/lessonPlan.js';

async function testAIService() {
  console.log('=== AIService 動作確認 ===\n');

  try {
    // AIServiceの初期化
    console.log('1. AIServiceを初期化中...');
    const aiService = createAIService();
    console.log('✅ AIService初期化成功\n');

    // プロバイダーの利用可能性チェック
    console.log('2. プロバイダーの利用可能性をチェック中...');
    const availability = await aiService.checkAvailability();
    console.log(`✅ Primary Provider: ${availability.primary ? '利用可能' : '利用不可'}`);
    console.log(`✅ Fallback Provider: ${availability.fallback !== null ? (availability.fallback ? '利用可能' : '利用不可') : '未設定'}\n`);

    // シンプルなコンテンツ生成テスト
    console.log('3. シンプルなコンテンツ生成テスト...');
    const systemPrompt = 'あなたはUnreal Engine 5.6の専門家です。';
    const userPrompt = 'Control Rigの基本概念を1文で説明してください。';

    console.log(`プロンプト: "${userPrompt}"`);
    console.log('生成中...\n');

    const response1 = await aiService.generateContent(userPrompt, systemPrompt);

    console.log('--- 生成結果 ---');
    console.log(`プロバイダー: ${response1.provider}`);
    console.log(`トークン使用量: ${response1.tokensUsed ?? '不明'}`);
    console.log(`コンテンツ:\n${response1.content}\n`);

    // セクション生成テスト
    console.log('4. セクション生成テスト（学習目標）...');
    const context = {
      theme: 'コントロールリグを使った自作アニメーション',
      targetVersion: '5.6',
      sectionType: SectionType.LEARNING_OBJECTIVES,
      latestInfo: []
    };

    console.log(`テーマ: ${context.theme}`);
    console.log('生成中...\n');

    const response2 = await aiService.generateSection(context);

    console.log('--- 生成結果 ---');
    console.log(`プロバイダー: ${response2.provider}`);
    console.log(`トークン使用量: ${response2.tokensUsed ?? '不明'}`);
    console.log(`コンテンツ:\n${response2.content}\n`);

    console.log('=== ✅ すべてのテスト成功 ===');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    if (error instanceof Error) {
      console.error(`  メッセージ: ${error.message}`);
      console.error(`  スタック:\n${error.stack}`);
    } else {
      console.error(`  ${String(error)}`);
    }
    process.exit(1);
  }
}

// テスト実行
testAIService();
