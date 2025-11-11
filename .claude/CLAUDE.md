# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

---

# Project Information

## プロジェクト概要

**プロジェクト名**: BlueprintEmulator（ブループリントエミュレーター）
**正式名称**: UE5.6教案自動生成システム
**開始日**: 2025-11-11
**現在のステータス**: 🔄 Phase 1 (PoC) - 実装中

### 目的
高校生向けプログラム教室で使用するUnreal Engine 5.6の学習教案を自動生成し、A4印刷対応のHTML形式で出力するシステムを開発する。

### 主要機能
1. **教案自動生成** - AIを活用してUE5.6の教案を自動作成
2. **最新情報検索** - UE5.6の最新ドキュメントを検索・反映
3. **図の自動生成** - Mermaid.jsでブループリント構造図を自動生成
4. **A4印刷対応** - 印刷に最適化されたHTML出力
5. **参考文献** - UE5.6公式ドキュメントへのリンク付き

### 対応テーマ（Phase 1）
1. コントロールリグを使った自作アニメーション
2. 必殺技演出の作成

### 技術スタック
- **言語**: TypeScript 5.x (strict mode)
- **ランタイム**: Node.js 18+
- **AIサービス**: OpenAI GPT-4 + Anthropic Claude（バックアップ）
- **検索**: MCP (Model Context Protocol) + Web Search API
- **図生成**: Mermaid.js
- **テストフレームワーク**: Vitest
- **インターフェース**: CLI（ora、chalk使用）

### プロジェクト構造
- `src/` - ソースコード
  - `cli/` - CLIインターフェース
  - `core/` - コアエンジン（LessonPlanGenerator）
  - `services/` - AIService、SearchService
  - `generators/` - DiagramGenerator、HTMLGenerator
  - `validators/` - InputValidator
  - `models/` - データモデル定義
  - `utils/` - ユーティリティ関数
  - `config/` - 設定管理
- `data/` - テンプレートデータ（themes、diagrams、knowledge）
- `output/` - 生成された教案HTML
- `tests/` - テストコード（unit、integration）
- `.tmp/` - 設計ドキュメント（requirements, design, test_design, tasks）
- `reports/` - 進捗レポート（MD形式）

### 現在のフェーズ
**Phase 1（PoC）**: 🔄 実装中（2025-11-11開始）
- Week 1（プロジェクト初期設定）: ✅ 完了
- Week 2（データ層実装）: 🔄 70%完了
- Week 3-6: 📋 未着手

**Phase 2（機能拡張）**: 検討中（Webインターフェース、テーマ追加、画像生成、PDF出力）

### 進捗管理
- 進捗レポートは `reports/progress_report_YYYYMMDD.md` 形式で保存
- 最新レポート: `reports/progress_report_20251111.md`
- タスク管理: `.tmp/tasks.md`（全85タスク定義）
- 全体進捗: 15%（13/85タスク完了）

### 重要な注意事項
- `.tmp/`フォルダ内のファイルがBlueprintEmulatorプロジェクトの実際の設計ドキュメントです。
- 進捗レポートは常に`reports/`フォルダに保存してください。
- UE5.6バージョン情報の厳格管理が重要です（古いバージョン情報の混入を防ぐ）。
- 教案生成は30秒以内を目標としています。

---

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Contex7 MCP** to retrieve the latest information.
- For temporary notes for design, create a markdown in `.tmp` and save it.
- **After using Write or Edit tools, ALWAYS verify the actual file contents using the Read tool**, regardless of what the system-reminder says. The system-reminder may incorrectly show "(no content)" even when the file has been successfully written.
- Please respond critically and without pandering to my opinions, but please don't be forceful in your criticism.

## Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).

## Development Style - Specification-Driven Development

### Overview

When receiving development tasks, please follow the 5-stage workflow below. This ensures requirement clarification, structured design, comprehensive testing, and efficient implementation.

### 5-Stage Workflow

#### Stage 1: Requirements

- Analyze user requests and convert them into clear functional requirements
- Document requirements in `.tmp/requirements.md`
- Use `/requirements` command for detailed template

#### Stage 2: Design

- Create technical design based on requirements
- Document design in `.tmp/design.md`
- Use `/design` command for detailed template

#### Stage 3: Test Design

- Create comprehensive test specification based on design
- Document test cases in `.tmp/test_design.md`
- Use `/test-design` command for detailed template

#### Stage 4: Task List

- Break down design and test cases into implementable units
- Document in `.tmp/tasks.md`
- Use `/tasks` command for detailed template
- Manage major tasks with TodoWrite tool

#### Stage 5: Implementation

- Implement according to task list
- For each task:
  - Update task to in_progress using TodoWrite
  - Execute implementation and testing
  - Run lint and typecheck
  - Update task to completed using TodoWrite

### Workflow Commands

- `/spec` - Start the complete specification-driven development workflow
- `/requirements` - Execute Stage 1: Requirements only
- `/design` - Execute Stage 2: Design only (requires requirements)
- `/test-design` - Execute Stage 3: Test design only (requires design)
- `/tasks` - Execute Stage 4: Task breakdown only (requires design and test design)

### Important Notes

- Each stage depends on the deliverables of the previous stage
- Please obtain user confirmation before proceeding to the next stage
- Always use this workflow for complex tasks or new feature development
- Simple fixes or clear bug fixes can be implemented directly

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
