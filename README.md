# Dota 2 Assistant Web

ガイド付きのランダムピックやポジション最適化を備えた Dota 2 向け支援アプリケーションです。React + Vite 製フロントエンドを Vercel に、Express ベースの API を AWS Lambda（API Gateway 経由）にデプロイし、DynamoDB をキャッシュストアとして利用する構成に刷新しました。公式 Dota 2 API の `herolist` と `herodata` をプロキシして提供します。

## 主な機能

- ヒーロー一覧の取得とロール／推奨ポジションの表示
- ポジション／言語フィルターによる候補絞り込み
- ランダムピックと履歴保持（ローカルストレージに最大 20 件）
- ヒーロー詳細（基礎ステータス、アビリティ、タレント）表示
- ポジションの上書き・リセットと再利用可能なキャッシュ

## 構成

```text
backend/   # Express + TypeScript → AWS Lambda 環境向けハンドラーと Serverless Framework 設定
frontend/  # React + Vite + MUI + React Query (SPA UI, Vercel デプロイ想定)
```

## 前提条件

- Node.js 18 以降（推奨 20 系）
- npm 9 以降

## セットアップ

```bash
# 依存関係の取得
cd backend && npm install
cd ../frontend && npm install
```

> フロントエンドの依存関係には `npm audit` で報告される中程度の脆弱性が 2 件あります。MUI の依存鎖に起因する既知の問題で、最新パッチ待ちです。必要に応じて `npm audit fix --force` を検討してください。

## 開発サーバーの起動

バックエンドとフロントエンドをそれぞれ別ターミナルで起動します。

```bash
# Backend (http://localhost:4000)
cd backend
npm run dev

# Frontend (http://localhost:5173)
cd frontend
npm run dev
```

フロントエンドは Vite のプロキシ設定により `/api/*` へのリクエストをバックエンドに転送します。

## ビルドと検証

```bash
# 型チェック & トランスパイル
cd backend && npm run build
cd frontend && npm run build

# Lint
cd backend && npm run lint
cd frontend && npm run lint
```

> フロントエンドの本番ビルド生成物に 500 kB を超えるチャンクが含まれるため、Vite から警告が表示されます。パフォーマンス上支障はありませんが、将来的にはコードスプリッティングを検討してください。

## デプロイ

### バックエンド（AWS Lambda + API Gateway）

```bash
cd backend

# 初回のみ AWS 認証情報と region を設定
export AWS_PROFILE=your-profile
export AWS_REGION=ap-northeast-1

# 必要に応じて CORS 許可を設定
export ALLOWED_ORIGINS="https://dota-assistant.vercel.app"

# パッケージ生成（確認用）
npm run package

# デプロイ
npm run deploy -- --stage prod
```

- `HERO_CACHE_TABLE` を指定しない場合、`dota2-assistant-backend-{stage}-hero-cache` という DynamoDB テーブルが自動作成されます。
- `DYNAMODB_ENDPOINT` を指定すれば LocalStack 等へのデプロイも可能です。
- 削除する際は `npm run remove -- --stage prod` を利用してください。

### フロントエンド（Vercel）

1. `frontend/.env.example` を参考に `.env` を作成し、`VITE_API_BASE_URL` に API Gateway の公開 URL（`/api` まで含む）を設定します。
2. Vercel プロジェクトに環境変数 `VITE_API_BASE_URL` を登録します（Preview/Production で値を切り替える場合はそれぞれ設定）。
3. `frontend` ディレクトリで `vercel deploy --prod` もしくは GitHub 連携による自動デプロイを利用します。

> API Gateway のエンドポイントは `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}` 形式です。Express 側は `/api/*` を提供するため、環境変数には末尾まで含めるよう注意してください。

## 環境変数

### Backend (Lambda)

| 変数名                   | 必須 | 説明                                                                                                                   |
| ------------------------ | ---- | ---------------------------------------------------------------------------------------------------------------------- |
| `AWS_REGION`             | ✅   | デプロイ先リージョン。Serverless Framework の `--region` 指定でも可。                                                  |
| `ALLOWED_ORIGINS`        | ⛔️  | CORS 許可するオリジンをカンマ区切りで指定（例: `https://example.com,https://staging.example.com`）。未指定時は全許可。 |
| `HERO_CACHE_TABLE`       | ⛔️  | DynamoDB テーブル名。未指定時は `dota2-assistant-backend-{stage}-hero-cache` が自動作成されます。                      |
| `HERO_CACHE_TTL_SECONDS` | ⛔️  | DynamoDB に保存するキャッシュ TTL（秒）。未指定時は個別の TTL 設定を利用。                                             |
| `DYNAMODB_ENDPOINT`      | ⛔️  | LocalStack などローカル DynamoDB を利用する場合のエンドポイント URL。                                                  |
| `PORT`                   | ⛔️  | ローカル開発サーバーの待受ポート（デフォルト 4000）。                                                                  |

### Frontend (Vercel)

| 変数名              | 必須 | 説明                                                                                                                 |
| ------------------- | ---- | -------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | ✅   | API Gateway のエンドポイント（`https://xxxx.execute-api.region.amazonaws.com/dev/api` のように `/api` まで含める）。 |

## キャッシュ戦略

- ヒーロー一覧: メモリ TTL（24 時間） + DynamoDB 永続キャッシュ
- ヒーロー詳細: メモリ TTL（7 日間） + DynamoDB 永続キャッシュ（詳細未取得時は一覧データを短期キャッシュ）

## ライセンス

MIT
