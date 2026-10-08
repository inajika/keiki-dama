# Contributing Guide
開発にご協力いただきありがとうございます。<br/>
開発を始める前にご一読ください。

## 必要なもの
- 開発用PC
- [Visual Studio Code](https://code.visualstudio.com/) (以下、VSCode)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/ja-jp/)
- [GitHub](https://github.co.jp/) アカウント
- [GitHub CLI](https://cli.github.com/) (任意。Issue や PR を CLI から操作したい場合に利用する)

## 環境構築

> [!NOTE]
> Windows マシンを開発に利用する場合、[WSL2](https://learn.microsoft.com/ja-jp/windows/wsl/install)環境にリポジトリを配置することを強く推奨します。

1. リポジトリをクローンする。
    ```bash
    git clone https://github.com/inajika/keiki-dama.git
    ```
2. リポジトリを VSCode で開く。
    ```bash
    code keiki-dama/
    ```
3. コマンドパレットを開き、`開発コンテナー: コンテナーで再度開く` を選択して DevContainer を開く
    <kbd>Ctrl</kbd> (macOS では <kbd>Command</kbd>) + <kbd>Shift</kbd> + <kbd>P</kbd> でコマンドパレットが開きます。

> [!NOTE]
> GitHub CLI は DevContainer には導入していません。Issue や PR を CLI から操作したい場合は、[公式の手順](https://github.com/cli/cli#installation)でホストにインストールしてください。必須ではなく、Web 上の操作でも同じことができます。

## 技術スタック

| 分類 | 技術 |
| --- | --- |
| 言語 | [TypeScript](https://www.typescriptlang.org/) (strict) |
| ランタイム | [Node.js](https://nodejs.org/) 24 (開発時) / [Cloudflare Workers](https://workers.cloudflare.com/) (本番) |
| フレームワーク | [Hono](https://hono.dev/) + [HonoX](https://github.com/honojs/honox) (ファイルベースルーティング、Islands アーキテクチャ) |
| UI | Hono JSX (`hono/jsx`) |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) v4 |
| ビルド・開発サーバー | [Vite](https://vite.dev/) |
| デプロイ | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Workers) |
| リンター・フォーマッター | [Biome](https://biomejs.dev/) |
| 開発環境 | Docker / DevContainer (VSCode) |

## よく使うコマンド
### ローカル実行
```bash
npm run dev

# Cloudflare Workers ランタイムを利用して確認したい場合は以下のコマンド
# (サーバー立ち上げ前にビルドが走るので、編集後はプロセスを再起動する必要があります)
npm run preview
```

ブラウザで `http://localhost:3000/` にアクセスすると確認できます。<br/>
なお、 `npm run dev` と `npm run preview` は待ち受けポート番号が同じであるため同時に実行できません。

### フォーマットチェック
```bash
npm run check
```

### フォーマットの自動修正
```bash
npm run check:fix
```

VSCode の設定で保存時に自動修正する設定にしていますが、AIエージェントで編集したときにはこのコマンドを実行してください。

### テスト
```bash
npm run test
```

### GitHub CLI (任意)
Web 上の操作でも同じことができます。

```bash
# Issue の一覧・詳細を確認する
gh issue list
gh issue view {Issue番号}

# 自分に Issue をアサインする
gh issue edit {Issue番号} --add-assignee @me

# develop ブランチ向けに PR を作成する (本文に `Closes #{Issue番号}` を記載する)
gh pr create --base develop
```

## Issue 駆動開発
開発は GitHub Issue を起点に進めます。

### 流れ
1. Issue を起票する。 (下記の[テンプレート](#issue-テンプレート)から選択する。)
2. 着手する Issue に自分をアサインする。
3. develop ブランチから[機能開発用ブランチ](#機能開発用ブランチ)を作成する。
4. 実装し、`npm run check:fix` と `npm run test` を実行する。
5. [コミットメッセージルール](#コミットメッセージルール)に従ってコミットする。
6. develop ブランチ向けの PR を作成し、本文に `Closes #{Issue番号}` を記載する。
7. レビュー後にマージする。マージすると Issue が自動的に Close される。

### Issue テンプレート
| テンプレート | 用途 | ラベル |
| --- | --- | --- |
| 機能追加 | 新機能の追加、既存機能の改善 | `enhancement` |
| バグ報告 | 不具合の報告 | `bug` |
| タスク | リファクタリング、環境整備、ドキュメント更新など | `task` |

- 空の Issue は作成できません。必ずテンプレートを利用してください。
- 「完了の定義 (DoD)」は、Close してよい状態をチェックリストで具体的に書きます。PR 作成前に DoD をすべて満たしているか確認してください。

### 1 Issue 1 PR
1 つの Issue に対して 1 つの PR を作成することを基本とします。Issue が大きい場合は分割してください。

## コーディングルール
コーディングをする際には以下を守ってください。

### 命名について
- 実装意図がわかるように「名は体を表す」命名とする。
- ファイル名はケバブケースで命名する。
- 変数名、関数名、プロパティ名はローワーキャメルケースで命名する。
- 定数名はアッパースネークケースで命名する。
- 型名、インターフェース名、クラス名、React コンポーネント名はアッパーキャメルケースで命名する。

### 実装について
- 画面やAPIのルーティング層 (`routes/`) 、ロジック層 (`logics/`) 、DBやAPIなどの外部連携層 (`repositories/`) の3つを基本として、適宜ディレクトリによる分類分けをする。
- 関数の責務は単一にする。

### テストコードについて
- テスト対象と同じ階層に `*.spec.ts` ファイルを配置して、そこに記述する。
- 適宜モック等を利用し、ホワイトボックステストを記述する。
- 原則、自前実装しているものに関してはテストコードを作成する。

### コメントについて
- JSDocを残すようにし、そこで何をするものなのかを明記します。
- なぜその実装であるのかという意図が分かりづらいときにはコメントを残します。

## ブランチ運用
### master ブランチ
リポジトリの安定ブランチ。<br/>
このブランチでの編集、直接プッシュは禁止です。

### develop ブランチ
開発終了後の機能がすべて存在しているブランチ。<br/>
本番リリースもこのブランチの内容で実施する。<br/>
本番リリースのタイミングで master ブランチにマージする PR を作成する。 (このとき、新バージョンとして PR を作成する。) <br/>
このブランチでの編集、直接プッシュは禁止です。

### 機能開発用ブランチ
develop ブランチから派生し、 `feature/{何するのかがわかるような英単語3語程度をケバブケースで記述}` という命名をする。
開発終了後は develop ブランチにマージする PR を作成する。

## コミットメッセージルール
[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に従ってコミットメッセージを日本語で記述します。

## バージョニング戦略
[セマンティックバージョニング](https://semver.org/lang/ja/)により、 [package.json](./package.json) 、Git のタグを定義します。
