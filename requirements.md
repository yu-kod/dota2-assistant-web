# Dota2 アシスタント WEB アプリケーション 要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名

Dota2 アシスタント（Dota2 Assistant Web Application）

### 1.2 プロジェクトの目的

Dota2 プレイヤーのゲームプレイ体験を向上させるための包括的な WEB アシスタントアプリケーションを開発する。リアルタイムでの戦略提案、ヒーロー選択支援、ビルドガイド、統計分析などを通じて、プレイヤーがより楽しく、効果的に Dota2 をプレイできるようサポートする。

### 1.3 対象ユーザー

- 初心者から上級者までの Dota2 プレイヤー
- より効率的なゲームプレイを目指すプレイヤー
- 戦略やビルドを学びたいプレイヤー
- チーム戦術を向上させたいプレイヤー

## 2. 機能要件

### 2.1 コア機能

#### 2.1.1 ヒーロー選択アシスタント

- **機能概要**: ドラフトフェーズでの最適なヒーロー選択をサポート
- **詳細機能**:
  - 敵チーム構成に対するカウンターヒーロー提案
  - チーム構成バランス分析
  - メタヒーローの勝率データ表示
  - ロール別ヒーロー推奨度ランキング
  - プレイヤーの得意ヒーロー分析

#### 2.1.2 アイテムビルドガイド

- **機能概要**: 状況に応じた最適なアイテムビルドを提案
- **詳細機能**:
  - ヒーロー別推奨スタートアイテム
  - ゲーム進行段階別アイテム推奨
  - 敵構成に応じたアイテム調整提案
  - プロプレイヤーのビルド参考
  - アイテム効果とシナジー解説

#### 2.1.3 リアルタイム戦略アドバイス

- **機能概要**: ゲーム中の状況判断をサポート
- **詳細機能**:
  - ファームスポット推奨
  - ガンク警告システム
  - オブジェクト（Roshan、Tower）タイミング提案
  - チームファイト推奨/回避判定
  - マップコントロール戦略提案

#### 2.1.4 統計・分析機能

- **機能概要**: プレイヤーのパフォーマンス分析と改善提案
- **詳細機能**:
  - 個人戦績詳細分析
  - ヒーロー別パフォーマンス
  - 勝率向上のための改善ポイント分析
  - ランキング推移追跡
  - チームメイトとの相性分析

### 2.2 サブ機能

#### 2.2.1 学習コンテンツ

- ヒーロー詳細ガイド
- アイテム効果辞典
- ゲームメカニクス解説
- プロマッチ分析
- 戦術パターン学習

#### 2.2.2 コミュニティ機能

- ユーザー間での戦略共有
- ビルドガイド投稿・評価
- 質問・回答フォーラム
- チーム募集掲示板

#### 2.2.3 カスタマイズ機能

- ユーザープロファイル設定
- 通知設定
- UI/UX カスタマイズ
- データ表示設定

## 3. 非機能要件

### 3.1 パフォーマンス要件

- **レスポンス時間**: 初回ページ表示 3 秒以内（CDN キャッシュ活用）
- **API レイテンシ**: Lambda コールドスタート時 1.5 秒以内、ウォーム時 400ms 以内
- **リアルタイム更新**: 1 秒以内でのデータ更新（WebSocket またはポーリング）
- **同時接続ユーザー**: 3000 ユーザー以上をサポート（Lambda 自動スケール）
- **可用性**: 99.9%以上のアップタイム（マルチ AZ 運用）

### 3.2 セキュリティ要件

- **認証**: OAuth 2.0 / OpenID Connect を使用した Steam 連携ログイン（AWS Cognito）
- **データ保護**: HTTPS/TLS1.2+（API Gateway, Vercel）
- **プライバシー**: DynamoDB 内データの暗号化（KMS）と IAM ポリシーによる最小権限管理
- **API 制限**: API Gateway レート制限 + WAF ルール
- **監査ログ**: CloudTrail/Vercel Audit ログにより操作履歴を保持

### 3.3 使いやすさ要件

- **レスポンシブデザイン**: モバイル・タブレット対応
- **直感的 UI**: 初心者でも使いやすいインターフェース
- **多言語対応**: 日本語・英語対応
- **アクセシビリティ**: WCAG 2.1 AA 準拠

### 3.4 互換性要件

- **ブラウザ対応**: Chrome、Firefox、Safari、Edge 最新版
- **OS 対応**: Windows、macOS、Linux
- **API 連携**: Dota2 公式 API、OpenDota API、Stratz API

## 4. 技術要件

### 4.1 システム構成

```text
Users ↔ CDN (Vercel Edge Network)
     ↓
   Frontend (React.js on Vercel)
     ↓ API リクエスト (HTTPS)
  Amazon API Gateway
     ↓
   AWS Lambda (Node.js/TypeScript)
     ↓
    Amazon DynamoDB
     ↓
    外部 API (Dota2, OpenDota, Stratz)
```

### 4.2 推奨技術スタック

#### 4.2.1 フロントエンド

- **フレームワーク**: React.js with TypeScript
- **状態管理**: Redux Toolkit
- **UI ライブラリ**: Material-UI または Ant Design
- **スタイリング**: Styled-components または CSS Modules
- **ビルド/デプロイ**: Vite (開発) + Vercel (ホスティング、Preview/Production)
- **テスト**: Jest + React Testing Library + Playwright（E2E, 任意）

#### 4.2.2 バックエンド

- **ランタイム**: AWS Lambda（Node.js 18.x）
- **アーキテクチャ**: Amazon API Gateway + Lambda（REST API）
- **フレームワーク**: Express.js 互換レイヤー（aws-serverless-express）または Lambda 最適化ハンドラー
- **言語**: TypeScript
- **API 設計**: RESTful API（GraphQL/AppSync 拡張は将来的に検討）
- **認証**: Steam OpenID（AWS Cognito + 外部 ID プロバイダー 連携）
- **テスト**: Jest + Supertest（ローカル API シミュレーション）

#### 4.2.3 データベース

- **メイン DB**: Amazon DynamoDB（パーティションキー設計に基づく NoSQL）
- **キャッシュ**: DynamoDB DAX または AWS ElastiCache（必要に応じて）
- **データアクセス**: AWS SDK for JavaScript v3（DynamoDB DocumentClient）

#### 4.2.4 インフラ・デプロイ

- **フロントエンド**: Vercel（Preview/Production 環境、自動 CDN 配信）
- **バックエンド**: AWS Lambda + Amazon API Gateway（Serverless Framework または AWS SAM による IaC）
- **データベース**: Amazon DynamoDB（マネージド）
- **CI/CD**: GitHub Actions（フロント: Vercel デプロイ, バックエンド: Serverless Framework デプロイ）
- **監視/ログ**: Amazon CloudWatch, AWS X-Ray, Vercel Analytics（任意）

### 4.3 外部 API 連携

- **Steam Web API**: プレイヤー情報取得
- **OpenDota API**: 詳細マッチデータ
- **Stratz API**: 統計データ・プロマッチ情報
- **Dota2 Game State Integration**: リアルタイムゲーム状態

## 5. データ要件

### 5.1 主要データエンティティ

- **ユーザー**: Steam ID（Partition Key）、地域、設定、統計
- **ヒーロー**: ヒーロー ID（Partition Key）、スキル、統計、メタデータ
- **アイテム**: アイテム ID（Partition Key）、効果、価格、ビルドパス
- **マッチ**: マッチ ID（Partition Key）、プレイヤー、統計、タイムスタンプ（Sort Key）
- **ビルド**: ビルド ID（Partition Key）、アイテム構成、状況、評価
- **学習ログ**: ユーザー別学習履歴、推奨内容フィードバック
- **分析キャッシュ**: サマリー統計（TTL による自動失効）

### 5.2 データ更新頻度

- **リアルタイム**: ゲーム状態（ゲーム中のみ、DynamoDB Streams + Lambda Triggers）
- **5 分間隔**: マッチ結果、統計（バッチ Lambda）
- **1 時間間隔**: メタ分析、ランキング（Step Functions）
- **日次**: 詳細統計、プロマッチ分析（ETL Lambda）

## 6. 開発スケジュール（概算）

### フェーズ 1: サーバーレス基盤構築（3 週間）

- IaC（Serverless Framework / AWS SAM）による環境セットアップ
- Vercel プロジェクト作成と環境変数管理
- AWS Cognito + Steam 認証フローの PoC
- DynamoDB テーブル設計・プロビジョニング

### フェーズ 2: コア機能 API & フロント（4-5 週間）

- ヒーロー選択アシスタント API（Lambda）
- アイテムビルドガイド API・データ投入パイプライン
- フロントエンド UI/UX 実装（Vercel Preview 運用）
- GitHub Actions による自動デプロイ整備

### フェーズ 3: リアルタイム & 分析拡張（3-4 週間）

- リアルタイム戦略アドバイス（WebSocket/API Gateway）
- DynamoDB Streams + Lambda での統計更新
- 詳細分析・ダッシュボード機能
- 学習コンテンツ整備

### フェーズ 4: 最適化・運用準備（2-3 週間）

- パフォーマンス最適化（Lambda メモリ調整、キャッシュ）
- コミュニティ機能、通知設定
- 監視/アラート整備（CloudWatch, Vercel Analytics）
- 運用ドキュメント整備、コスト最適化レビュー

## 7. 成功指標

### 7.1 技術指標

- **パフォーマンス**: ページ読み込み時間 < 3 秒
- **可用性**: アップタイム > 99.5%
- **スケーラビリティ**: 同時ユーザー 1000 人以上

### 7.2 ビジネス指標

- **ユーザー獲得**: 月間アクティブユーザー 1000 人
- **エンゲージメント**: 平均セッション時間 15 分以上
- **リテンション**: 週次リテンション率 30%以上

## 8. リスクと対策

### 8.1 技術リスク

- **API 制限**: 複数 API 併用、キャッシュ戦略
- **データ精度**: データ検証ロジック、異常値検出
- **パフォーマンス**: Lambda コールドスタート対策、エッジキャッシュ活用
- **サーバーレスの可観測性**: CloudWatch/X-Ray の計測不足による障害検知遅延
- **DynamoDB 設計**: 誤ったパーティションキー設計によるホットパーティション・スロットリング

### 8.2 ビジネスリスク

- **競合サービス**: 独自機能による差別化
- **ユーザー獲得**: コミュニティマーケティング
- **継続性**: 収益化モデルの検討
- **コスト最適化**: Lambda 実行回数・DynamoDB 課金の予想外増加
- **ベンダーロックイン**: AWS + Vercel 依存による移行コスト

## 9. 次期実装ステップ

1. **IaC 実装**: Serverless Framework もしくは AWS SAM で API Gateway/Lambda/DynamoDB リソースを定義し、CI/CD パイプラインに組み込む。
2. **認証統合**: AWS Cognito と Steam OpenID の連携を実装し、トークン検証ロジックを Lambda に組み込む。
3. **データアクセスレイヤー**: DynamoDB DocumentClient を活用したリポジトリ層を実装し、既存 PostgreSQL 依存コードを移行する。
4. **ローカル開発環境**: Vite + Vercel CLI、AWS SAM Local もしくは LocalStack による統合テスト環境を整備する。
5. **監視・アラート設定**: CloudWatch Logs/Alarms、X-Ray トレース、Vercel Analytics を設定し、SLO ベースのアラートを定義する。
6. **コストモニタリング**: AWS Budgets アラート、DynamoDB Capacity モニタリングを設定し、利用状況の可視化ダッシュボードを作成する。

---

**作成日**: 2025 年 10 月 16 日  
**バージョン**: 1.0  
**作成者**: Dota2 アシスタント開発チーム
