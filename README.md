# BlueprintEmulator（ブループリントエミュレーター）

[![CI/CD Pipeline](https://github.com/TakaI2/BluePrintEmurator/actions/workflows/ci.yml/badge.svg)](https://github.com/TakaI2/BluePrintEmurator/actions/workflows/ci.yml)
[![Code Quality](https://github.com/TakaI2/BluePrintEmurator/actions/workflows/code-quality.yml/badge.svg)](https://github.com/TakaI2/BluePrintEmurator/actions/workflows/code-quality.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

UE5.6教案自動生成システム - Unreal Engine 5.6 Lesson Plan Generator

## 概要

高校生向けのプログラム教室で使用するUnreal Engine 5.6の学習教案を自動生成するシステムです。教師/講師がテーマを指定するだけで、体系的な学習コンテンツが自動作成され、A4印刷対応のHTML形式で出力されます。

## 主な機能

- 📝 **教案自動生成**: AIを活用してUE5.6の教案を自動作成
- 🔍 **最新情報検索**: UE5.6の最新ドキュメントを検索・反映
- 📊 **図の自動生成**: Mermaid.jsでブループリント構造図を自動生成
- 🖨️ **A4印刷対応**: 印刷に最適化されたHTML出力
- 📚 **参考文献**: UE5.6公式ドキュメントへのリンク付き

## 対象バージョン

- **Unreal Engine**: 5.6
- **注意**: 古いバージョン（UE4, UE5.0-5.5）の情報は使用しません

## システム要件

- Node.js 20.x以上
- npm 10.x以上

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd BlueprintEmurator
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、APIキーを設定：

```bash
cp .env.example .env
```

`.env` ファイルを編集：

```env
# OpenAI API Key (必須)
OPENAI_API_KEY=sk-your-openai-api-key

# または Anthropic Claude API Key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

## 使用方法

### 教案の生成

```bash
npm run generate -- "UE5のコントロールリグを使った自作アニメーション"
```

生成されたHTMLファイルは `output/` ディレクトリに保存されます。

### 開発モード

```bash
npm run dev
```

### テストの実行

```bash
# すべてのテストを実行
npm test

# カバレッジ付きでテスト
npm run test:coverage

# UIモードでテスト
npm run test:ui
```

### ビルド

```bash
npm run build
```

## プロジェクト構造

```
BlueprintEmurator/
├── src/                    # ソースコード
│   ├── cli/               # CLIインターフェース
│   ├── core/              # コアエンジン
│   ├── services/          # サービス層（AI、検索）
│   ├── generators/        # 生成層（図、HTML）
│   ├── validators/        # バリデーション
│   ├── models/            # データモデル
│   ├── utils/             # ユーティリティ
│   └── config/            # 設定管理
├── data/                  # データファイル
│   ├── themes/           # テーマテンプレート
│   ├── diagrams/         # 図テンプレート
│   └── knowledge/        # UE5ナレッジベース
├── output/               # 生成されたHTML
├── tests/                # テストコード
│   ├── unit/            # 単体テスト
│   └── integration/     # 統合テスト
├── .tmp/                 # 設計ドキュメント
│   ├── requirements.md  # 要件定義書
│   ├── design.md        # 技術設計書
│   ├── test_design.md   # テスト設計書
│   └── tasks.md         # タスクリスト
└── README.md
```

## 実装済み機能（Phase 1 - 進行中）

### ✅ Week 1: プロジェクト初期設定（完了）
- [x] プロジェクト初期化（npm, TypeScript）
- [x] 依存パッケージのインストール
- [x] ディレクトリ構造の作成
- [x] 環境変数設定
- [x] テストフレームワーク設定（Vitest）

### ✅ Week 2: データ層（進行中）
- [x] データモデル定義（TypeScript interfaces）
- [x] テーマテンプレートJSON作成（2テーマ）
- [x] エラー定義
- [x] 定数定義
- [x] Config管理実装
- [ ] ユーティリティ実装
- [ ] バリデーション実装

### 🔄 Week 3-6: 実装中
- 詳細は `.tmp/tasks.md` を参照

## 対応テーマ

現在、以下の2つのテーマに対応しています：

1. **コントロールリグを使った自作アニメーション**
   - 難易度: 中級
   - 所要時間: 2-3時間
   - キーワード: Control Rig, Animation, IK, FK

2. **必殺技演出の作成**
   - 難易度: 中級
   - 所要時間: 3-4時間
   - キーワード: Animation, VFX, Niagara, Timeline, Camera

## 技術スタック

- **言語**: TypeScript 5.x
- **ランタイム**: Node.js 20.x
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **テスト**: Vitest
- **図生成**: Mermaid.js
- **検索**: MCP, Web Search API

## 開発フロー

このプロジェクトは **Specification-Driven Development** で開発されています：

1. **Stage 1**: 要件定義（Requirements）→ `.tmp/requirements.md`
2. **Stage 2**: 技術設計（Design）→ `.tmp/design.md`
3. **Stage 3**: テスト設計（Test Design）→ `.tmp/test_design.md`
4. **Stage 4**: タスクリスト（Task List）→ `.tmp/tasks.md`
5. **Stage 5**: 実装（Implementation）← **現在ここ**

## ライセンス

MIT

## 貢献

Phase 1（PoC）完了後にコントリビューションガイドラインを公開予定です。

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
