# テスト設計書（Test Design Specification）

## プロジェクト名
**BlueprintEmulator（ブループリントエミュレーター）**
UE5.6教案自動生成システム

**バージョン**: 1.0
**対象**: Phase 1 (PoC)
**作成日**: 2025-11-11

---

## 1. テスト戦略

### 1.1 テストレベル

| テストレベル | 目的 | 実施タイミング | ツール |
|------------|------|--------------|--------|
| **単体テスト** | 各コンポーネントの機能を個別に検証 | 実装中・実装後 | Vitest |
| **統合テスト** | コンポーネント間の連携を検証 | 実装後 | Vitest |
| **E2Eテスト** | システム全体の動作を検証 | 統合後 | Vitest + 実行 |
| **パフォーマンステスト** | 応答時間・スループットを検証 | E2E後 | カスタムスクリプト |
| **品質保証テスト** | 生成された教案の品質を検証 | E2E後 | 手動 + 自動 |

### 1.2 テスト環境

```
開発環境:
- OS: Windows 11 / macOS / Linux
- Node.js: 20.x
- TypeScript: 5.x

テストデータ:
- テーマテンプレート: 2種類（Control Rig、必殺技演出）
- モックAI応答
- モック検索結果
```

### 1.3 成功基準

- **単体テスト**: カバレッジ80%以上
- **統合テスト**: すべての主要フロー成功
- **E2Eテスト**: 2つのテーマで教案生成成功
- **パフォーマンス**: 30秒以内に生成完了
- **品質保証**: レビューチェックリスト100%合格

---

## 2. 単体テスト（Unit Tests）

### 2.1 Input Validator

#### テストケース: UT-001 正常なテーマ入力
```typescript
describe('InputValidator', () => {
  it('正常なUE5テーマを受け入れる', () => {
    const validator = new InputValidator();
    const result = validator.validate('UE5のコントロールリグを使った自作アニメーション');

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

#### テストケース: UT-002 空文字列の拒否
```typescript
it('空文字列を拒否する', () => {
  const validator = new InputValidator();
  const result = validator.validate('');

  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('テーマが入力されていません');
});
```

#### テストケース: UT-003 長すぎる入力の拒否
```typescript
it('1000文字を超える入力を拒否する', () => {
  const validator = new InputValidator();
  const longTheme = 'a'.repeat(1001);
  const result = validator.validate(longTheme);

  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('テーマは1000文字以内で入力してください');
});
```

#### テストケース: UT-004 UE5関連でない入力への警告
```typescript
it('UE5に関連しない入力に警告を出す', () => {
  const validator = new InputValidator();
  const result = validator.validate('Pythonでデータ分析する方法');

  expect(result.isValid).toBe(true); // 拒否はしないが警告
  expect(result.warnings).toContain('このテーマはUE5に関連していない可能性があります');
});
```

**カバレッジ目標**: 90%以上

---

### 2.2 AI Service

#### テストケース: UT-010 セクション生成（モック使用）
```typescript
describe('AIService', () => {
  it('学習目標セクションを正しく生成する', async () => {
    const mockAIClient = {
      createChatCompletion: vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: '1. コントロールリグの基本概念を理解する\n2. リグを設定できる'
          }
        }]
      })
    };

    const aiService = new AIService(mockAIClient);
    const content = await aiService.generateSection(
      SectionType.LEARNING_OBJECTIVES,
      { theme: 'コントロールリグ', searchResults: [] }
    );

    expect(content).toContain('コントロールリグ');
    expect(mockAIClient.createChatCompletion).toHaveBeenCalledTimes(1);
  });
});
```

#### テストケース: UT-011 エラーハンドリング
```typescript
it('API障害時に適切なエラーを投げる', async () => {
  const mockAIClient = {
    createChatCompletion: vi.fn().mockRejectedValue(new Error('API Error'))
  };

  const aiService = new AIService(mockAIClient);

  await expect(
    aiService.generateSection(SectionType.LEARNING_OBJECTIVES, { theme: 'test' })
  ).rejects.toThrow(AppError);
});
```

#### テストケース: UT-012 タイムアウト処理
```typescript
it('30秒でタイムアウトする', async () => {
  const mockAIClient = {
    createChatCompletion: vi.fn().mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 31000))
    )
  };

  const aiService = new AIService(mockAIClient);

  await expect(
    aiService.generateSection(SectionType.LEARNING_OBJECTIVES, { theme: 'test' })
  ).rejects.toThrow('タイムアウト');
}, 32000);
```

**カバレッジ目標**: 85%以上

---

### 2.3 Search Service

#### テストケース: UT-020 バージョンフィルタリング
```typescript
describe('SearchService', () => {
  it('UE5.6の結果のみを返す', () => {
    const searchService = new SearchService();
    const results: SearchResult[] = [
      { title: 'UE5.6 Control Rig', url: '...', snippet: 'UE5.6の新機能', version: '5.6' },
      { title: 'UE5.5 Control Rig', url: '...', snippet: 'UE5.5での方法', version: '5.5' },
      { title: 'UE5.6 Tutorial', url: '...', snippet: 'Latest tutorial', version: '5.6' }
    ];

    const filtered = searchService.filterByVersion(results, '5.6');

    expect(filtered).toHaveLength(2);
    expect(filtered.every(r => r.version === '5.6')).toBe(true);
  });
});
```

#### テストケース: UT-021 古いバージョンの除外
```typescript
it('UE4とUE5.5以前の結果を除外する', () => {
  const searchService = new SearchService();
  const results: SearchResult[] = [
    { title: 'UE4 Tutorial', url: '...', snippet: 'UE4での方法' },
    { title: 'UE5.6 Guide', url: '...', snippet: 'UE5.6の新機能' }
  ];

  const filtered = searchService.filterByVersion(results, '5.6');

  expect(filtered).toHaveLength(1);
  expect(filtered[0].title).toBe('UE5.6 Guide');
});
```

#### テストケース: UT-022 検索クエリ構築
```typescript
it('UE5.6専用のクエリを構築する', () => {
  const searchService = new SearchService();
  const query = searchService.buildUE56Query('Control Rig animation');

  expect(query).toContain('UE5.6');
  expect(query).toContain('Control Rig animation');
  expect(query).toContain('-"5.5"');
  expect(query).toContain('-"UE4"');
});
```

**カバレッジ目標**: 85%以上

---

### 2.4 Diagram Generator

#### テストケース: UT-030 ブループリント図生成
```typescript
describe('DiagramGenerator', () => {
  it('正しいMermaid.js構文を生成する', () => {
    const generator = new DiagramGenerator();
    const nodes: Node[] = [
      { id: 'A', label: '入力イベント', type: NodeType.EVENT },
      { id: 'B', label: '条件分岐', type: NodeType.CONDITION },
      { id: 'C', label: 'アニメーション再生', type: NodeType.ACTION }
    ];
    const connections: Connection[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C', label: 'True' }
    ];

    const mermaidCode = generator.generateBlueprintDiagram(nodes, connections);

    expect(mermaidCode).toContain('graph LR');
    expect(mermaidCode).toContain('A[入力イベント]');
    expect(mermaidCode).toContain('B{条件分岐}');
    expect(mermaidCode).toContain('A --> B');
    expect(mermaidCode).toContain('B -->|True| C');
  });
});
```

#### テストケース: UT-031 タイムライン図生成
```typescript
it('タイムライン図を生成する', () => {
  const generator = new DiagramGenerator();
  const timeline: Timeline = {
    events: [
      { time: 0, action: 'アニメーション開始' },
      { time: 0.5, action: 'エフェクト発生' },
      { time: 1.0, action: 'カメラシェイク' }
    ]
  };

  const mermaidCode = generator.generateTimelineDiagram(timeline);

  expect(mermaidCode).toContain('gantt');
  expect(mermaidCode).toContain('アニメーション開始');
  expect(mermaidCode).toContain('エフェクト発生');
});
```

**カバレッジ目標**: 80%以上

---

### 2.5 HTML Generator

#### テストケース: UT-040 HTML構造生成
```typescript
describe('HTMLGenerator', () => {
  it('正しいHTML構造を生成する', () => {
    const generator = new HTMLGenerator();
    const lessonPlan: LessonPlan = {
      id: '1',
      title: 'テスト教案',
      theme: 'Control Rig',
      targetVersion: '5.6',
      createdAt: new Date('2025-11-11'),
      sections: [],
      diagrams: [],
      references: []
    };

    const html = generator.generate(lessonPlan);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="ja">');
    expect(html).toContain('テスト教案');
    expect(html).toContain('UE5.6対応');
  });
});
```

#### テストケース: UT-041 Mermaid.js埋め込み
```typescript
it('Mermaid.js図を正しく埋め込む', () => {
  const generator = new HTMLGenerator();
  const lessonPlan: LessonPlan = {
    // ... 基本情報
    diagrams: [
      {
        id: '1',
        type: DiagramType.BLUEPRINT_FLOW,
        title: 'ブループリント構造',
        mermaidCode: 'graph LR\n  A --> B',
        description: 'テスト図'
      }
    ]
  };

  const html = generator.generate(lessonPlan);

  expect(html).toContain('mermaid.min.js');
  expect(html).toContain('<div class="mermaid">');
  expect(html).toContain('graph LR');
});
```

#### テストケース: UT-042 印刷用CSS生成
```typescript
it('印刷用CSSを含む', () => {
  const generator = new HTMLGenerator();
  const lessonPlan: LessonPlan = { /* ... */ };

  const html = generator.generate(lessonPlan);

  expect(html).toContain('@media print');
  expect(html).toContain('@page');
  expect(html).toContain('size: A4');
});
```

**カバレッジ目標**: 85%以上

---

## 3. 統合テスト（Integration Tests）

### 3.1 教案生成フロー全体

#### テストケース: IT-001 テーマ入力から教案生成まで
```typescript
describe('教案生成フロー統合テスト', () => {
  it('Control Rigテーマで教案を生成する', async () => {
    const theme = 'UE5のコントロールリグを使った自作アニメーション';

    // モックサービスのセットアップ
    const mockAIService = new MockAIService();
    const mockSearchService = new MockSearchService();

    const generator = new LessonPlanGenerator(mockAIService, mockSearchService);
    const lessonPlan = await generator.generate(theme);

    // 検証
    expect(lessonPlan).toBeDefined();
    expect(lessonPlan.title).toContain('コントロールリグ');
    expect(lessonPlan.targetVersion).toBe('5.6');
    expect(lessonPlan.sections).toHaveLength(10); // 10セクション
    expect(lessonPlan.diagrams.length).toBeGreaterThan(0);
    expect(lessonPlan.references.length).toBeGreaterThan(0);
  });
});
```

#### テストケース: IT-002 必殺技演出テーマで教案生成
```typescript
it('必殺技演出テーマで教案を生成する', async () => {
  const theme = 'アニメーションを使って必殺技の演出をつくる';

  const mockAIService = new MockAIService();
  const mockSearchService = new MockSearchService();

  const generator = new LessonPlanGenerator(mockAIService, mockSearchService);
  const lessonPlan = await generator.generate(theme);

  expect(lessonPlan).toBeDefined();
  expect(lessonPlan.title).toContain('必殺技');
  expect(lessonPlan.sections).toHaveLength(10);
});
```

### 3.2 検索サービスとAIサービスの連携

#### テストケース: IT-010 検索結果をAIプロンプトに反映
```typescript
it('検索結果をAI生成に活用する', async () => {
  const searchService = new SearchService(new MockMCPClient(), new MockWebSearchClient());
  const aiService = new AIService(new MockAIClient());

  const searchResults = await searchService.searchLatestInfo('Control Rig UE5.6');
  const content = await aiService.generateSection(
    SectionType.IMPLEMENTATION_STEPS,
    { theme: 'Control Rig', searchResults }
  );

  expect(content).toBeDefined();
  expect(content.length).toBeGreaterThan(100);
  // 検索結果の内容が反映されていることを確認
  expect(content).toContain('UE5.6');
});
```

### 3.3 図生成とHTML生成の連携

#### テストケース: IT-020 図がHTMLに正しく埋め込まれる
```typescript
it('生成された図がHTMLに埋め込まれる', async () => {
  const lessonPlan: LessonPlan = { /* ... */ };
  const diagramGenerator = new DiagramGenerator();
  const htmlGenerator = new HTMLGenerator();

  // 図を生成
  const diagram = diagramGenerator.generateBlueprintDiagram(
    [{ id: 'A', label: 'Start', type: NodeType.EVENT }],
    []
  );
  lessonPlan.diagrams.push(diagram);

  // HTMLに変換
  const html = htmlGenerator.generate(lessonPlan);

  expect(html).toContain('<div class="mermaid">');
  expect(html).toContain(diagram.mermaidCode);
});
```

**成功基準**: すべてのテストケースが成功

---

## 4. E2Eテスト（End-to-End Tests）

### 4.1 コマンドライン実行テスト

#### テストケース: E2E-001 CLIからの完全な教案生成
```typescript
describe('E2Eテスト: CLI実行', () => {
  it('CLIから教案を生成しHTMLファイルを出力する', async () => {
    // CLIコマンドを実行
    const result = await execCommand('npm run generate -- "Control Rig animation"');

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('教案を生成中');
    expect(result.stdout).toContain('HTMLファイルを出力しました');

    // 出力ファイルの確認
    const outputPath = path.join('output', 'lesson-plan-*.html');
    const files = glob.sync(outputPath);
    expect(files.length).toBeGreaterThan(0);

    // HTMLファイルの内容確認
    const html = fs.readFileSync(files[0], 'utf-8');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Control Rig');
    expect(html).toContain('UE5.6');
  }, 60000); // 60秒タイムアウト
});
```

#### テストケース: E2E-002 生成されたHTMLのブラウザ表示
```typescript
it('生成されたHTMLをブラウザで開ける', async () => {
  const outputPath = path.join('output', 'lesson-plan-test.html');

  // 教案生成
  await execCommand(`npm run generate -- "Control Rig" --output ${outputPath}`);

  // HTMLが有効か検証（簡易的）
  const html = fs.readFileSync(outputPath, 'utf-8');

  // 必須要素の確認
  expect(html).toContain('<html lang="ja">');
  expect(html).toContain('mermaid.min.js');
  expect(html).toMatch(/<h1>.*<\/h1>/);
  expect(html).toMatch(/<div class="mermaid">/);
});
```

### 4.2 実テーマでの生成テスト

#### テストケース: E2E-010 Control Rigテーマ
```typescript
it('Control Rigテーマで完全な教案を生成する', async () => {
  const theme = 'UE5.6のコントロールリグを使い、自作のアニメーションを作る方法';
  const result = await execCommand(`npm run generate -- "${theme}"`);

  expect(result.exitCode).toBe(0);

  const outputFile = getLatestOutputFile();
  const html = fs.readFileSync(outputFile, 'utf-8');

  // 必須セクションの確認
  expect(html).toContain('学習目標');
  expect(html).toContain('前提知識');
  expect(html).toContain('実装手順');
  expect(html).toContain('ブループリント実装');
  expect(html).toContain('図解');
  expect(html).toContain('トラブルシューティング');
  expect(html).toContain('参考文献');

  // UE5.6関連の確認
  expect(html).toContain('5.6');
  expect(html).not.toContain('5.5');
  expect(html).not.toContain('UE4');
}, 60000);
```

#### テストケース: E2E-011 必殺技演出テーマ
```typescript
it('必殺技演出テーマで完全な教案を生成する', async () => {
  const theme = 'そのアニメーションを使って必殺技の演出をつくる';
  const result = await execCommand(`npm run generate -- "${theme}"`);

  expect(result.exitCode).toBe(0);

  const outputFile = getLatestOutputFile();
  const html = fs.readFileSync(outputFile, 'utf-8');

  // テーマ固有の内容確認
  expect(html).toContain('必殺技');
  expect(html).toContain('演出');
  expect(html).toContain('タイムライン');
  expect(html).toContain('エフェクト');

  // 図の確認
  expect(html).toMatch(/graph LR|sequenceDiagram|gantt/);
}, 60000);
```

**成功基準**: 2つのテーマで完全な教案が生成される

---

## 5. パフォーマンステスト

### 5.1 生成時間計測

#### テストケース: PERF-001 30秒以内に生成完了
```typescript
describe('パフォーマンステスト', () => {
  it('教案生成が30秒以内に完了する', async () => {
    const startTime = Date.now();

    const generator = new LessonPlanGenerator();
    await generator.generate('Control Rig animation');

    const elapsedTime = Date.now() - startTime;

    expect(elapsedTime).toBeLessThan(30000); // 30秒
  }, 35000);
});
```

#### テストケース: PERF-002 HTML出力時間
```typescript
it('HTML出力が10秒以内に完了する', () => {
  const lessonPlan: LessonPlan = { /* 完全な教案データ */ };

  const startTime = Date.now();
  const htmlGenerator = new HTMLGenerator();
  const html = htmlGenerator.generate(lessonPlan);
  const elapsedTime = Date.now() - startTime;

  expect(elapsedTime).toBeLessThan(10000); // 10秒
  expect(html.length).toBeGreaterThan(1000);
});
```

### 5.2 キャッシュ効果測定

#### テストケース: PERF-010 2回目の生成が高速化
```typescript
it('キャッシュにより2回目の検索が高速化される', async () => {
  const searchService = new SearchService();

  // 1回目
  const start1 = Date.now();
  await searchService.searchLatestInfo('Control Rig');
  const time1 = Date.now() - start1;

  // 2回目（キャッシュヒット）
  const start2 = Date.now();
  await searchService.searchLatestInfo('Control Rig');
  const time2 = Date.now() - start2;

  // 2回目は1回目より速い
  expect(time2).toBeLessThan(time1 * 0.5);
});
```

**成功基準**: すべてのパフォーマンス要件を満たす

---

## 6. 品質保証テスト

### 6.1 教案コンテンツ品質チェック

#### テストケース: QA-001 必須セクションの存在確認
```typescript
describe('品質保証テスト', () => {
  it('すべての必須セクションが含まれる', async () => {
    const lessonPlan = await generateLessonPlan('Control Rig');

    const requiredSectionTypes = [
      SectionType.LEARNING_OBJECTIVES,
      SectionType.PREREQUISITES,
      SectionType.FEATURES_USED,
      SectionType.IMPLEMENTATION_STEPS,
      SectionType.BLUEPRINT_IMPLEMENTATION,
      SectionType.SETTINGS,
      SectionType.DIAGRAMS,
      SectionType.TROUBLESHOOTING,
      SectionType.ADVANCED_CHALLENGES,
      SectionType.REFERENCES
    ];

    const sectionTypes = lessonPlan.sections.map(s => s.type);

    requiredSectionTypes.forEach(type => {
      expect(sectionTypes).toContain(type);
    });
  });
});
```

#### テストケース: QA-002 UE5.6バージョン情報の確認
```typescript
it('UE5.6の情報のみが含まれる', async () => {
  const lessonPlan = await generateLessonPlan('Control Rig');
  const html = new HTMLGenerator().generate(lessonPlan);

  // 新しいバージョン情報が含まれる
  expect(html).toContain('5.6');

  // 古いバージョン情報が含まれない
  expect(html).not.toMatch(/5\.[0-5]|UE4/);
});
```

#### テストケース: QA-003 参考文献の妥当性
```typescript
it('参考文献にUE5.6のURLが含まれる', async () => {
  const lessonPlan = await generateLessonPlan('Control Rig');

  expect(lessonPlan.references.length).toBeGreaterThan(0);

  lessonPlan.references.forEach(ref => {
    expect(ref.version).toBe('5.6');
    expect(ref.url).toMatch(/docs\.unrealengine\.com.*5\.6/);
  });
});
```

### 6.2 Mermaid.js図の妥当性

#### テストケース: QA-010 図の構文チェック
```typescript
it('Mermaid.js図が正しい構文である', async () => {
  const lessonPlan = await generateLessonPlan('Control Rig');

  lessonPlan.diagrams.forEach(diagram => {
    // 基本構文チェック
    expect(diagram.mermaidCode).toMatch(/^(graph|sequenceDiagram|gantt|stateDiagram)/);

    // ノード定義が含まれる
    expect(diagram.mermaidCode).toMatch(/[A-Z]\[.+\]|[A-Z]\{.+\}/);
  });
});
```

### 6.3 HTML出力の妥当性

#### テストケース: QA-020 A4印刷対応の確認
```typescript
it('A4印刷用のCSSが含まれる', async () => {
  const lessonPlan = await generateLessonPlan('Control Rig');
  const html = new HTMLGenerator().generate(lessonPlan);

  expect(html).toContain('@media print');
  expect(html).toContain('size: A4');
  expect(html).toContain('max-width: 210mm');
});
```

#### テストケース: QA-021 リンクの表示確認
```typescript
it('印刷時にリンクURLが表示される', () => {
  const html = new HTMLGenerator().generate(mockLessonPlan);

  expect(html).toContain('::after');
  expect(html).toContain('attr(href)');
});
```

**成功基準**: すべての品質チェック項目が合格

---

## 7. 手動テストチェックリスト

### 7.1 教案内容の人間レビュー

| 項目 | チェック内容 | 合格基準 |
|------|------------|---------|
| **正確性** | UE5.6の情報が正確か | 公式ドキュメントと一致 |
| **完全性** | 手順に抜け漏れがないか | 実装可能なレベル |
| **明確性** | 高校生が理解できるか | 専門用語に説明あり |
| **実用性** | 教室で使用できるか | 教師が説明可能 |
| **最新性** | 古い情報がないか | UE5.6のみ |

### 7.2 HTML出力の目視確認

| 項目 | チェック内容 | 合格基準 |
|------|------------|---------|
| **レイアウト** | 見やすく整理されているか | セクション分けが明確 |
| **図の表示** | Mermaid図が正しく表示されるか | ブラウザで確認 |
| **印刷** | A4用紙に印刷して読めるか | 実際に印刷してチェック |
| **リンク** | 参考文献のリンクが機能するか | クリックして確認 |
| **レスポンシブ** | タブレットで表示できるか | 複数デバイスで確認 |

### 7.3 実際の教室での試用

| 項目 | チェック内容 | 合格基準 |
|------|------------|---------|
| **教師のフィードバック** | 教案が使いやすいか | 満足度80%以上 |
| **生徒の理解度** | 生徒が内容を理解できるか | 理解度テスト70点以上 |
| **実装成功率** | 生徒が実装できるか | 80%以上が完成 |

---

## 8. テスト実施計画

### 8.1 タイムライン

| フェーズ | 期間 | 担当 | 成果物 |
|---------|------|------|--------|
| **単体テスト実装** | Week 3-4 | 開発者 | テストコード |
| **統合テスト実装** | Week 4 | 開発者 | テストコード |
| **E2Eテスト実施** | Week 5 | 開発者 | テスト結果レポート |
| **パフォーマンステスト** | Week 5 | 開発者 | パフォーマンスレポート |
| **品質保証テスト** | Week 5 | QA担当 | 品質レポート |
| **手動テスト** | Week 6 | QA + 教師 | チェックリスト |
| **教室試用** | Week 6 | 教師 + 生徒 | フィードバック |

### 8.2 テストデータ準備

```typescript
// tests/fixtures/themes.ts
export const testThemes = [
  {
    id: 'control-rig',
    input: 'UE5.6のコントロールリグを使い、自作のアニメーションを作る方法',
    expectedKeywords: ['コントロールリグ', 'アニメーション', 'IK', 'FK']
  },
  {
    id: 'special-move',
    input: 'そのアニメーションを使って必殺技の演出をつくる',
    expectedKeywords: ['必殺技', 'エフェクト', 'タイムライン', 'カメラ']
  }
];

// tests/fixtures/mockResponses.ts
export const mockAIResponses = {
  learningObjectives: `
1. コントロールリグの基本概念を理解する
2. リグを設定してキーフレームアニメーションを作成できる
3. ブループリントでアニメーションを再生できる
  `,
  // ... 他のセクション
};
```

---

## 9. バグ管理

### 9.1 バグ重要度分類

| 重要度 | 定義 | 対応時期 |
|--------|------|---------|
| **Critical** | システムが動作しない | 即座に修正 |
| **High** | 主要機能が使えない | Phase 1内に修正 |
| **Medium** | 一部機能に問題 | Phase 2で修正 |
| **Low** | UIの軽微な問題 | Phase 2以降 |

### 9.2 バグレポートテンプレート

```markdown
## バグ報告

**ID**: BUG-001
**重要度**: High
**発見日**: 2025-11-11
**発見者**: テスト担当者

### 症状
教案生成時にUE5.5の情報が混入している

### 再現手順
1. `npm run generate -- "Control Rig"`を実行
2. 出力されたHTMLを開く
3. 参考文献セクションを確認

### 期待される動作
UE5.6の情報のみが含まれる

### 実際の動作
UE5.5のドキュメントリンクが含まれている

### 環境
- OS: Windows 11
- Node.js: 20.10.0
- コミット: abc1234

### スクリーンショット
[添付]

### 修正方針
SearchServiceのバージョンフィルタリングを強化
```

---

## 10. テスト完了基準

### 10.1 Phase 1 完了条件

- [ ] 単体テスト: カバレッジ80%以上、すべてのテスト成功
- [ ] 統合テスト: すべてのテストケース成功
- [ ] E2Eテスト: 2つのテーマで教案生成成功
- [ ] パフォーマンステスト: 30秒以内に生成完了
- [ ] 品質保証テスト: すべてのチェック項目合格
- [ ] 手動テスト: 教師レビュー合格
- [ ] 教室試用: フィードバック収集完了
- [ ] Critical/Highバグ: すべて修正完了

### 10.2 リリース判定

上記すべての条件を満たした場合、Phase 1をリリース可能と判定する。

---

**テスト設計完了日**: 2025-11-11
**次フェーズ**: タスクリスト作成（Task List）
