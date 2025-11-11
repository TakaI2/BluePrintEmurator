# Contributing to BlueprintEmulator

BlueprintEmulatorへの貢献に興味を持っていただきありがとうございます！

## 開発環境のセットアップ

### 前提条件
- Node.js 18.x以上
- npm 9.x以上

### セットアップ手順
```bash
# リポジトリをクローン
git clone https://github.com/TakaI2/BluePrintEmurator.git
cd BluePrintEmurator

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定

# ビルド
npm run build

# テストを実行
npm test
```

## 開発フロー

### ブランチ戦略
- `main` - 本番環境用の安定版
- `develop` - 開発中の最新版
- `feature/*` - 新機能開発用
- `fix/*` - バグ修正用

### 作業手順
1. Issueを作成または既存のIssueを確認
2. `develop`ブランチから作業用ブランチを作成
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. コードを実装
4. テストを追加/更新
5. コミット
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
6. プッシュ
   ```bash
   git push origin feature/your-feature-name
   ```
7. Pull Requestを作成

### コミットメッセージ規約
[Conventional Commits](https://www.conventionalcommits.org/)に従ってください。

- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメントのみの変更
- `style:` - コードの意味に影響しない変更（空白、フォーマットなど）
- `refactor:` - リファクタリング
- `test:` - テストの追加・修正
- `chore:` - ビルドプロセスやツールの変更

例：
```
feat: add PromptBuilder for AI prompt generation
fix: resolve XSS vulnerability in InputValidator
docs: update README with installation instructions
```

## コーディング規約

### TypeScript
- TypeScript strict modeを使用
- `any`型の使用を避ける
- interfaceを使用して型を明示的に定義

### テスト
- 新機能には単体テストを追加
- テストカバレッジは80%以上を目標
- Vitestを使用

### コードスタイル
- Prettierでフォーマット（予定）
- ESLintのルールに従う（予定）

## Pull Requestのガイドライン

### PRを作成する前に
- [ ] テストが通ることを確認
- [ ] ビルドが成功することを確認
- [ ] コードレビューを依頼する準備ができている

### PRの説明
- 何を変更したかを明確に記載
- なぜその変更が必要かを説明
- 関連するIssue番号を記載

## 質問や相談
IssueやDiscussionsで気軽に質問してください。

## ライセンス
貢献されたコードは、プロジェクトのライセンス（MIT License）の下で公開されます。
