# タスクリスト（Task List）

## プロジェクト名
**BlueprintEmulator（ブループリントエミュレーター）**
UE5.6教案自動生成システム

**バージョン**: 1.0
**対象**: Phase 1 (PoC)
**作成日**: 2025-11-11

---

## タスク管理ルール

### ステータス
- **TODO**: 未着手
- **IN_PROGRESS**: 作業中
- **BLOCKED**: 依存タスク待ち
- **DONE**: 完了
- **SKIPPED**: スキップ（Phase 2以降）

### 優先度
- **P0**: Critical - 必須、即対応
- **P1**: High - Phase 1で必須
- **P2**: Medium - あれば良い
- **P3**: Low - Phase 2以降

### 工数見積もり
- **S**: 0.5日以下
- **M**: 0.5-1日
- **L**: 1-2日
- **XL**: 2日以上

---

## Phase 1: 実装タスク一覧

### 1. プロジェクト初期設定 (Week 1)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-001** | プロジェクト初期化 (npm init, TypeScript設定) | P0 | S | - | TODO | Dev |
| **TASK-002** | 依存パッケージのインストール | P0 | S | TASK-001 | TODO | Dev |
| **TASK-003** | ディレクトリ構造の作成 | P0 | S | TASK-001 | TODO | Dev |
| **TASK-004** | 環境変数設定 (.env.example作成) | P0 | S | TASK-001 | TODO | Dev |
| **TASK-005** | Git初期化とリポジトリ設定 | P1 | S | TASK-001 | TODO | Dev |
| **TASK-006** | テストフレームワーク設定 (Vitest) | P0 | S | TASK-002 | TODO | Dev |
| **TASK-007** | ESLint/Prettier設定 | P2 | S | TASK-002 | TODO | Dev |

**Week 1完了条件**: プロジェクト環境が整い、ビルド・テストが実行できる

---

### 2. データ層の実装 (Week 2)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-010** | データモデル定義 (TypeScript interfaces) | P0 | M | TASK-001 | TODO | Dev |
| **TASK-011** | テーマテンプレートJSON作成 (2テーマ) | P0 | M | TASK-010 | TODO | Dev |
| **TASK-012** | 図テンプレートJSON作成 | P1 | S | TASK-010 | TODO | Dev |
| **TASK-013** | UE5.6機能ナレッジベースJSON作成 | P2 | M | - | TODO | Dev |
| **TASK-014** | エラー定義 (AppError, ErrorType) | P0 | S | TASK-010 | TODO | Dev |
| **TASK-015** | 定数定義 (constants.ts) | P0 | S | TASK-010 | TODO | Dev |

**Week 2完了条件**: すべてのデータモデルと初期データが準備完了

---

### 3. ユーティリティ層の実装 (Week 2)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-020** | ヘルパー関数実装 (ID生成、日付フォーマットなど) | P0 | S | TASK-010 | TODO | Dev |
| **TASK-021** | InputSanitizer実装 | P0 | S | TASK-010 | TODO | Dev |
| **TASK-022** | PromptBuilder実装 | P0 | M | TASK-010 | TODO | Dev |
| **TASK-023** | Config管理実装 | P0 | S | TASK-004 | TODO | Dev |
| **TASK-024** | CacheService実装 | P1 | M | TASK-010 | TODO | Dev |

**完了条件**: ユーティリティがすべて実装され、単体テスト済み

---

### 4. バリデーション層の実装 (Week 2)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-030** | InputValidator実装 | P0 | M | TASK-010, TASK-021 | TODO | Dev |
| **TASK-031** | InputValidator単体テスト | P0 | M | TASK-030 | TODO | Dev |

**完了条件**: InputValidatorが完成し、テスト済み

---

### 5. サービス層の実装 (Week 3)

#### 5.1 AI Service

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-040** | AIService基本構造実装 | P0 | M | TASK-010, TASK-022 | TODO | Dev |
| **TASK-041** | OpenAI API統合 | P0 | M | TASK-040 | TODO | Dev |
| **TASK-042** | Anthropic Claude API統合 (オプション) | P2 | M | TASK-040 | TODO | Dev |
| **TASK-043** | セクション別プロンプト実装 | P0 | L | TASK-041 | TODO | Dev |
| **TASK-044** | AIServiceエラーハンドリング | P0 | S | TASK-041 | TODO | Dev |
| **TASK-045** | AIServiceリトライ機能 | P0 | M | TASK-044 | TODO | Dev |
| **TASK-046** | AIService単体テスト (モック使用) | P0 | L | TASK-045 | TODO | Dev |

#### 5.2 Search Service

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-050** | SearchService基本構造実装 | P0 | M | TASK-010 | TODO | Dev |
| **TASK-051** | MCPClient実装 | P1 | L | TASK-050 | TODO | Dev |
| **TASK-052** | WebSearchClient実装 | P1 | L | TASK-050 | TODO | Dev |
| **TASK-053** | バージョンフィルタリング実装 | P0 | M | TASK-050 | TODO | Dev |
| **TASK-054** | 検索クエリ構築ロジック | P0 | M | TASK-050 | TODO | Dev |
| **TASK-055** | SearchServiceキャッシング統合 | P1 | S | TASK-024, TASK-050 | TODO | Dev |
| **TASK-056** | SearchService単体テスト | P0 | L | TASK-055 | TODO | Dev |

**Week 3完了条件**: AIServiceとSearchServiceが完成し、テスト済み

---

### 6. 生成層の実装 (Week 3)

#### 6.1 Diagram Generator

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-060** | DiagramGenerator基本構造実装 | P0 | M | TASK-010 | TODO | Dev |
| **TASK-061** | ブループリントフロー図生成 | P0 | M | TASK-060 | TODO | Dev |
| **TASK-062** | タイムライン図生成 | P1 | M | TASK-060 | TODO | Dev |
| **TASK-063** | アニメーションブループリント図生成 | P1 | M | TASK-060 | TODO | Dev |
| **TASK-064** | ノード抽出ロジック実装 | P0 | M | TASK-061 | TODO | Dev |
| **TASK-065** | DiagramGenerator単体テスト | P0 | M | TASK-064 | TODO | Dev |

#### 6.2 HTML Generator

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-070** | HTMLGenerator基本構造実装 | P0 | M | TASK-010 | TODO | Dev |
| **TASK-071** | HTMLヘッダー生成 (CSS含む) | P0 | M | TASK-070 | TODO | Dev |
| **TASK-072** | セクション生成ロジック | P0 | M | TASK-070 | TODO | Dev |
| **TASK-073** | Mermaid.js埋め込み実装 | P0 | M | TASK-070 | TODO | Dev |
| **TASK-074** | 印刷用CSS実装 (@media print) | P0 | M | TASK-071 | TODO | Dev |
| **TASK-075** | A4レイアウト調整 | P0 | M | TASK-074 | TODO | Dev |
| **TASK-076** | 参考文献セクション生成 | P0 | S | TASK-072 | TODO | Dev |
| **TASK-077** | HTMLGenerator単体テスト | P0 | L | TASK-076 | TODO | Dev |

**Week 3完了条件**: DiagramGeneratorとHTMLGeneratorが完成し、テスト済み

---

### 7. コアエンジンの実装 (Week 4)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-080** | LessonPlanGenerator基本構造実装 | P0 | M | TASK-010 | TODO | Dev |
| **TASK-081** | 教案生成フロー実装 | P0 | L | TASK-080, TASK-045, TASK-055 | TODO | Dev |
| **TASK-082** | セクション並列生成実装 | P1 | M | TASK-081 | TODO | Dev |
| **TASK-083** | 最新情報エンリッチメント | P0 | M | TASK-081, TASK-055 | TODO | Dev |
| **TASK-084** | 図生成統合 | P0 | M | TASK-081, TASK-065 | TODO | Dev |
| **TASK-085** | エラーハンドリング統合 | P0 | M | TASK-081 | TODO | Dev |
| **TASK-086** | タイムアウト制御実装 | P0 | S | TASK-085 | TODO | Dev |
| **TASK-087** | LessonPlanGenerator単体テスト | P0 | L | TASK-086 | TODO | Dev |

**Week 4完了条件**: コアエンジンが完成し、単体テスト済み

---

### 8. CLI層の実装 (Week 4)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-090** | CLIインターフェース基本実装 | P0 | M | TASK-010 | TODO | Dev |
| **TASK-091** | テーマ入力プロンプト実装 | P0 | S | TASK-090 | TODO | Dev |
| **TASK-092** | 進捗表示実装 (ora使用) | P1 | S | TASK-090 | TODO | Dev |
| **TASK-093** | エラーメッセージ表示 | P0 | S | TASK-090 | TODO | Dev |
| **TASK-094** | HTMLファイル出力実装 | P0 | M | TASK-090, TASK-077 | TODO | Dev |
| **TASK-095** | コマンドライン引数処理 | P1 | S | TASK-090 | TODO | Dev |
| **TASK-096** | CLI統合テスト | P0 | M | TASK-095 | TODO | Dev |

**Week 4完了条件**: CLIが完成し、コアエンジンと統合済み

---

### 9. 統合テストの実装 (Week 4)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-100** | 統合テスト環境構築 | P0 | S | TASK-006 | TODO | Dev |
| **TASK-101** | モックサービス実装 | P0 | M | TASK-100 | TODO | Dev |
| **TASK-102** | 教案生成フロー統合テスト | P0 | L | TASK-101, TASK-087 | TODO | Dev |
| **TASK-103** | 検索-AI連携テスト | P0 | M | TASK-102 | TODO | Dev |
| **TASK-104** | 図生成-HTML生成連携テスト | P0 | M | TASK-102 | TODO | Dev |

**Week 4完了条件**: すべての統合テストが実装され、成功している

---

### 10. E2Eテストの実装 (Week 5)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-110** | E2Eテストスクリプト作成 | P0 | M | TASK-096 | TODO | Dev |
| **TASK-111** | Control Rigテーマでの完全生成テスト | P0 | M | TASK-110 | TODO | Dev |
| **TASK-112** | 必殺技演出テーマでの完全生成テスト | P0 | M | TASK-110 | TODO | Dev |
| **TASK-113** | HTMLファイル検証テスト | P0 | M | TASK-111, TASK-112 | TODO | Dev |
| **TASK-114** | ブラウザ表示確認テスト | P1 | S | TASK-113 | TODO | Dev |

---

### 11. パフォーマンステスト (Week 5)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-120** | 生成時間計測スクリプト作成 | P0 | S | TASK-111 | TODO | Dev |
| **TASK-121** | 30秒以内生成確認 | P0 | M | TASK-120 | TODO | Dev |
| **TASK-122** | HTML出力時間計測 | P0 | S | TASK-120 | TODO | Dev |
| **TASK-123** | キャッシュ効果検証 | P1 | M | TASK-120 | TODO | Dev |
| **TASK-124** | パフォーマンス改善 (必要に応じて) | P1 | L | TASK-121 | TODO | Dev |

---

### 12. 品質保証テスト (Week 5)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-130** | 自動品質チェックスクリプト作成 | P0 | M | TASK-113 | TODO | Dev |
| **TASK-131** | 必須セクション存在確認テスト | P0 | S | TASK-130 | TODO | Dev |
| **TASK-132** | UE5.6バージョン情報確認テスト | P0 | M | TASK-130 | TODO | Dev |
| **TASK-133** | 参考文献妥当性テスト | P0 | S | TASK-130 | TODO | Dev |
| **TASK-134** | Mermaid.js図構文チェックテスト | P0 | M | TASK-130 | TODO | Dev |
| **TASK-135** | A4印刷対応確認テスト | P0 | M | TASK-130 | TODO | Dev |

---

### 13. 手動テストとレビュー (Week 5-6)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-140** | 生成された教案の内容レビュー | P0 | L | TASK-112 | TODO | QA |
| **TASK-141** | HTML出力の目視確認 | P0 | M | TASK-113 | TODO | QA |
| **TASK-142** | A4用紙への実印刷テスト | P0 | S | TASK-141 | TODO | QA |
| **TASK-143** | 複数ブラウザでの表示確認 | P1 | M | TASK-141 | TODO | QA |
| **TASK-144** | タブレットでの表示確認 | P2 | S | TASK-141 | TODO | QA |
| **TASK-145** | 教師による教案レビュー | P0 | L | TASK-140 | TODO | Teacher |
| **TASK-146** | フィードバック収集と改善 | P0 | L | TASK-145 | TODO | Dev |

---

### 14. 教室での試用 (Week 6)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-150** | 教室試用の準備 | P0 | M | TASK-146 | TODO | Teacher |
| **TASK-151** | Control Rig授業実施 | P0 | L | TASK-150 | TODO | Teacher |
| **TASK-152** | 必殺技演出授業実施 | P0 | L | TASK-150 | TODO | Teacher |
| **TASK-153** | 生徒アンケート実施 | P0 | S | TASK-151, TASK-152 | TODO | Teacher |
| **TASK-154** | 教師フィードバック収集 | P0 | M | TASK-151, TASK-152 | TODO | Teacher |
| **TASK-155** | 改善点の洗い出し | P0 | M | TASK-153, TASK-154 | TODO | Dev + Teacher |

---

### 15. ドキュメント作成 (Week 5-6)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-160** | README.md作成 | P0 | M | TASK-096 | TODO | Dev |
| **TASK-161** | セットアップガイド作成 | P0 | S | TASK-160 | TODO | Dev |
| **TASK-162** | 使用方法マニュアル作成 | P0 | M | TASK-160 | TODO | Dev |
| **TASK-163** | トラブルシューティングガイド作成 | P1 | M | TASK-146 | TODO | Dev |
| **TASK-164** | API設計ドキュメント作成 | P2 | M | TASK-087 | TODO | Dev |
| **TASK-165** | コード内コメント整備 | P1 | L | TASK-096 | TODO | Dev |

---

### 16. バグ修正と最終調整 (Week 6)

| ID | タスク | 優先度 | 工数 | 依存 | ステータス | 担当 |
|----|--------|--------|------|------|-----------|------|
| **TASK-170** | Critical/Highバグ修正 | P0 | XL | TASK-155 | TODO | Dev |
| **TASK-171** | Mediumバグ修正 (時間があれば) | P2 | L | TASK-170 | TODO | Dev |
| **TASK-172** | コード品質向上 (リファクタリング) | P1 | L | TASK-170 | TODO | Dev |
| **TASK-173** | 最終回帰テスト | P0 | L | TASK-172 | TODO | Dev |
| **TASK-174** | リリースビルド作成 | P0 | S | TASK-173 | TODO | Dev |

---

## タスク進捗サマリー

### Week 1: 環境構築
- **タスク数**: 7
- **総工数**: 3日
- **完了条件**: ビルド・テスト環境が整備されている

### Week 2: データ層・ユーティリティ層・バリデーション層
- **タスク数**: 12
- **総工数**: 5日
- **完了条件**: データモデルと基礎ユーティリティが完成

### Week 3: サービス層・生成層
- **タスク数**: 18
- **総工数**: 10日
- **完了条件**: すべての主要サービスが実装済み

### Week 4: コアエンジン・CLI・統合テスト
- **タスク数**: 17
- **総工数**: 9日
- **完了条件**: システムが統合され、テスト済み

### Week 5: E2E・パフォーマンス・品質保証
- **タスク数**: 15
- **総工数**: 8日
- **完了条件**: すべてのテストが成功

### Week 6: 手動テスト・教室試用・最終調整
- **タスク数**: 16
- **総工数**: 10日
- **完了条件**: Phase 1リリース準備完了

**合計タスク数**: 85
**合計工数見積もり**: 45日（約6週間）

---

## 依存関係グラフ

```
TASK-001 (初期化)
  ├─→ TASK-002 (パッケージ)
  │     ├─→ TASK-006 (テスト設定)
  │     └─→ TASK-007 (Linter)
  ├─→ TASK-003 (ディレクトリ)
  ├─→ TASK-004 (環境変数)
  │     └─→ TASK-023 (Config)
  ├─→ TASK-005 (Git)
  └─→ TASK-010 (データモデル)
        ├─→ TASK-011 (テーマJSON)
        ├─→ TASK-012 (図JSON)
        ├─→ TASK-013 (ナレッジベース)
        ├─→ TASK-014 (エラー定義)
        ├─→ TASK-015 (定数)
        ├─→ TASK-020-024 (ユーティリティ)
        ├─→ TASK-030-031 (バリデーション)
        ├─→ TASK-040-046 (AI Service)
        ├─→ TASK-050-056 (Search Service)
        ├─→ TASK-060-065 (Diagram Generator)
        ├─→ TASK-070-077 (HTML Generator)
        └─→ TASK-080-087 (Core Engine)
              └─→ TASK-090-096 (CLI)
                    └─→ TASK-100-174 (テスト・試用・リリース)
```

---

## クリティカルパス

Phase 1を成功させるために、以下のクリティカルパスを優先的に完了させる必要があります：

1. **TASK-001~006**: プロジェクト初期化とテスト環境
2. **TASK-010**: データモデル定義（すべての基礎）
3. **TASK-011**: テーマテンプレート作成（2テーマ必須）
4. **TASK-040~046**: AI Service（教案生成のコア）
5. **TASK-050~056**: Search Service（UE5.6情報取得）
6. **TASK-060~065**: Diagram Generator（Mermaid.js図生成）
7. **TASK-070~077**: HTML Generator（A4印刷対応）
8. **TASK-080~087**: LessonPlanGenerator（統合）
9. **TASK-090~096**: CLI（ユーザーインターフェース）
10. **TASK-111~112**: 2テーマのE2Eテスト
11. **TASK-121**: 30秒以内生成確認
12. **TASK-130~135**: 品質保証テスト
13. **TASK-145~146**: 教師レビューと改善
14. **TASK-151~155**: 教室試用とフィードバック
15. **TASK-170**: Critical/Highバグ修正

**クリティカルパス工数**: 約30日

---

## リスク管理

### 高リスクタスク

| タスクID | リスク内容 | 影響 | 対策 |
|---------|-----------|------|------|
| **TASK-041** | OpenAI API障害 | 教案生成不可 | Anthropic Claude APIをバックアップとして準備 |
| **TASK-051** | MCP実装の複雑さ | スケジュール遅延 | Web検索APIを優先、MCPは後回し可 |
| **TASK-082** | 並列生成の複雑さ | パフォーマンス未達 | シーケンシャル生成でも可 |
| **TASK-121** | 30秒以内達成困難 | 要件未達 | キャッシング強化、セクション削減 |
| **TASK-145** | 教師レビュー不合格 | 品質未達 | プロンプト改善、反復修正 |
| **TASK-151-152** | 教室試用で問題発覚 | リリース延期 | Week 5までに品質を十分確保 |

### リスク軽減策

1. **早期テスト**: 単体テストを実装と同時進行
2. **モック使用**: 外部APIはモックで開発を進める
3. **段階的統合**: コンポーネントごとに動作確認
4. **定期レビュー**: Week終了ごとにレビュー会実施
5. **バッファ確保**: Week 6に調整期間を設定

---

## Phase 2以降のタスク (参考)

Phase 1完了後に検討するタスク：

- **UI改善**: WebインターフェースへのCLI置き換え
- **テーマ追加**: 10種類以上のテーマテンプレート
- **画像生成**: スクリーンショット自動生成
- **PDF出力**: HTMLからPDF変換
- **ユーザー認証**: ログイン機能
- **履歴管理**: 生成履歴の保存と再利用
- **多言語対応**: 英語教案の生成

---

**タスクリスト作成日**: 2025-11-11
**次フェーズ**: 実装開始（Implementation）
