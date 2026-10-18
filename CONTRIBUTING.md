# Contributing Guide
開発にご協力いただきありがとうございます。<br/>
開発を始める前にご一読ください。

## 必要なもの
- 開発用PC
- [Visual Studio Code](https://code.visualstudio.com/) (以下、VSCode)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/ja-jp/)
- [GitHub](https://github.co.jp/) アカウント
- [GitHub CLI](https://cli.github.com/) (任意。PR を CLI から操作したい場合に利用する)

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
> GitHub CLI は DevContainer には導入していません。PR を CLI から操作したい場合は、[公式の手順](https://github.com/cli/cli#installation)でホストにインストールしてください。必須ではなく、Web 上の操作でも同じことができます。

## 技術スタック

| 分類 | 技術 |
| --- | --- |
| 言語 | [TypeScript](https://www.typescriptlang.org/) (strict) |
| ランタイム | [Node.js](https://nodejs.org/) 24 (開発時) / [Cloudflare Workers](https://workers.cloudflare.com/) (本番) |
| フレームワーク | [Hono](https://hono.dev/) + [HonoX](https://github.com/honojs/honox) (ファイルベースルーティング、Islands アーキテクチャ) |
| UI | Hono JSX (`hono/jsx`) |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) v4 |
| ビルド・開発サーバー | [Vite](https://vite.dev/) |
| コンポーネントカタログ | [Storybook](https://storybook.js.org/) (`@storybook/html-vite`) |
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

### KV・Cron を使った確認
> [!NOTE]
> KV・Cron は実装前のため、以下は設計時点の想定です。実装時に動作確認して確定してください。

`npm run dev` (Vite) では KV と Cron は使えません。確認は `npm run preview` (`wrangler dev`) で行います。

```bash
# Cron の実行 (Cron を `wrangler dev --test-scheduled` で起動してから呼び出す)
curl "http://localhost:3000/__scheduled?cron=*+*+*+*+*"

# KV の確認・編集 (ローカルのエミュレート環境)
npx wrangler kv key get --binding=INDICATORS --local indicators:latest
npx wrangler kv key put --binding=INDICATORS --local indicators:latest '{...}'
```

外部 API の鍵は、リポジトリにコミットしない `.dev.vars` に書きます。本番は `wrangler secret put` で設定します。

### Storybook
コンポーネントの見た目をサーバー起動なしで確認できます。ストーリーは対象コンポーネントと同じ階層の `*.stories.tsx` に記述します。

```bash
npm run storybook
```

ブラウザで `http://localhost:6006/` にアクセスすると確認できます。<br/>
hono/jsx はサーバーサイド専用のため、`renderHtmlStory` ([story-utils.tsx](./app/lib/story-utils.tsx)) で HTML 文字列にして表示しています。そのためイベントや状態は動作せず、`args` で与えた props の静的な見た目のみ確認できます。

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
# develop ブランチ向けに PR を作成する
gh pr create --base develop
```

## デプロイ
master ブランチへのマージ (本番リリース) をトリガーに、GitHub Actions ([deploy.yml](./.github/workflows/deploy.yml)) が `npm run check`、`npm run test` を実行したあと、Cloudflare Workers へデプロイします。<br/>
GitHub の Actions タブから `Deploy` ワークフローを手動実行 (`workflow_dispatch`) することもできます。

デプロイには、GitHub の `production` Environment (Settings → Environments) の Secrets に以下の登録が必要です。

| Secret | 内容 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare の API トークン (「Edit Cloudflare Workers」テンプレートで作成) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare のアカウント ID |

## コーディングルール
コーディングをする際には以下を守ってください。

### 命名について
- 実装意図がわかるように「名は体を表す」命名とする。
- ファイル名はケバブケースで命名する。
- 変数名、関数名、プロパティ名はローワーキャメルケースで命名する。
- 定数名はアッパースネークケースで命名する。
- 型名、インターフェース名、クラス名、React コンポーネント名はアッパーキャメルケースで命名する。

### 画面設計について
- スマートフォン (縦画面) での表示を前提とし、モバイルファーストで実装する。
- 補足情報はページ遷移させず、ポップアップ (モーダル等) での表示を優先する。

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
