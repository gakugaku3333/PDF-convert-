# 📹 動画手順書生成アプリ (Video to Manual Generator)

iPhone・Android対応の動画から自動で手順書を生成するWebアプリケーションです。Gemini AIを使用して、動画の内容を分析し、ステップバイステップの詳細な手順書を日本語で作成します。

## ✨ 主な機能

- 📱 **スマホ対応**: iPhone・Android両対応のレスポンシブデザイン
- 🎥 **動画撮影**: ブラウザから直接動画を録画可能
- 📤 **ファイルアップロード**: 既存の動画ファイルのアップロード対応
- 🤖 **AI自動分析**: Gemini 2.0 Flash Expによる高精度な内容分析
- 🎯 **テーマ自動判定**: テーマ入力不要で、AIが動画から自動判定
- 📝 **手順書生成**: 詳細なステップバイステップ手順書の自動生成
- ✏️ **対話的修正**: 生成後に自然な言葉でAIに修正を依頼可能
- 🖼️ **画像付き説明**: 各ステップに対応する画像を自動で紐付け
- 🖨️ **印刷・ダウンロード**: 生成した手順書を印刷またはダウンロード可能
- 🌐 **PWA対応**: ホーム画面に追加してアプリとして使用可能

## 🛠️ 技術スタック

### フロントエンド
- React 18
- CSS3 (モバイルファースト設計)
- Axios (HTTP通信)
- PWA (Progressive Web App)

### バックエンド
- Node.js
- Express
- Multer (ファイルアップロード)
- FFmpeg (動画処理)
- Google Gemini API (AI分析)

## 📋 前提条件

以下がインストールされている必要があります：

- Node.js (v14以上)
- npm または yarn
- FFmpeg (動画処理に必要)
- Gemini APIキー

### FFmpegのインストール

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
1. [FFmpeg公式サイト](https://ffmpeg.org/download.html)からダウンロード
2. 環境変数PATHに追加

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd PDF-convert-
```

### 2. 依存関係のインストール

```bash
# ルートディレクトリで実行（全ての依存関係を一括インストール）
npm run install-all
```

または個別にインストール：

```bash
# ルートディレクトリ
npm install

# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

### 3. 環境変数の設定

バックエンドディレクトリに`.env`ファイルを作成：

```bash
cd backend
cp .env.example .env
```

`.env`ファイルを編集してGemini APIキーを設定：

```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
MAX_FILE_SIZE=100mb
```

### Gemini APIキーの取得方法

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. "Create API Key"をクリック
4. 生成されたAPIキーをコピーして`.env`ファイルに貼り付け

## 🏃 起動方法

### 開発環境での起動

ルートディレクトリから以下のコマンドで、バックエンドとフロントエンドを同時に起動：

```bash
npm run dev
```

または個別に起動：

```bash
# バックエンド（ターミナル1）
cd backend
npm start

# フロントエンド（ターミナル2）
cd frontend
npm start
```

アプリケーションが起動したら、ブラウザで以下のURLにアクセス：

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000

## 📱 使い方

### 1. 手順書のテーマを入力（任意）

手順書の内容を説明するテーマを入力します（省略可）。

**テーマを入力する場合**：
- 「コーヒーの淹れ方」
- 「スマートフォンの初期設定方法」
- 「プリンターのインク交換手順」

**テーマを入力しない場合**：
- AIが動画の内容を自動分析してテーマを判定します

💡 **ヒント**: テーマを入力すると、より正確な手順書が生成されます

### 2. 動画の準備

以下のいずれかの方法で動画を用意：

#### 📹 ブラウザで録画
1. 「動画を録画する」ボタンをタップ
2. カメラへのアクセスを許可
3. 録画開始（作業を実演）
4. 「録画停止」ボタンで終了

#### 📁 ファイルから選択
1. 「ファイルから選択」をタップ
2. デバイスから動画ファイルを選択

### 3. 手順書の生成

1. 「手順書を生成する」ボタンをタップ
2. AIが動画を分析（通常30秒〜1分程度）
3. 生成された手順書を確認

### 4. AIに修正を依頼（NEW! ✨）

生成された手順書が気に入らない場合、自然な言葉でAIに修正を依頼できます：

1. 「AIに修正を依頼する」ボタンをクリック
2. 修正内容を自然な言葉で入力

**修正の例**：
- 「ステップ3をもっと詳しく説明して」
- 「必要なものに『お湯』を追加して」
- 「注意点をもっと強調して」
- 「全体的にもっと簡潔にして」
- 「初心者向けにわかりやすく書き直して」

3. 「修正を依頼」ボタンをクリック
4. AIが手順書を修正（数秒〜10秒程度）
5. 修正された手順書を確認

💡 **ヒント**: 何度でも修正を依頼できます！

### 5. 手順書の活用

- 📄 **閲覧**: ステップごとに画像付きで表示
- ✏️ **修正**: AIに修正を依頼して内容を改善
- 🖨️ **印刷**: プリンターで印刷可能
- 💾 **ダウンロード**: テキストファイルとして保存
- 🔄 **新規作成**: 新しい手順書を作成

## 📸 撮影のコツ

良い手順書を生成するための撮影ポイント：

- ✅ 各手順をゆっくり、はっきりと実演する
- ✅ 手元がよく見えるように明るい場所で撮影
- ✅ 重要なポイントで一時停止してから次の動作へ
- ✅ スマホを横向きにすると見やすい
- ✅ 2分〜5分程度の長さが最適
- ❌ 暗い場所や手ブレが多い撮影は避ける

## 🏗️ プロジェクト構成

```
PDF-convert-/
├── backend/                # バックエンド
│   ├── services/          # ビジネスロジック
│   │   ├── videoProcessor.js     # 動画処理（FFmpeg）
│   │   └── manualGenerator.js    # 手順書生成（Gemini AI）
│   ├── uploads/           # 動画アップロード先
│   ├── frames/            # 抽出されたフレーム
│   ├── server.js          # Expressサーバー
│   ├── package.json
│   └── .env.example
├── frontend/              # フロントエンド
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json  # PWA設定
│   ├── src/
│   │   ├── components/    # Reactコンポーネント
│   │   │   ├── VideoUpload.js       # 動画アップロード
│   │   │   ├── LoadingScreen.js     # ローディング画面
│   │   │   └── ManualDisplay.js     # 手順書表示
│   │   ├── App.js         # メインアプリ
│   │   ├── index.js
│   │   └── serviceWorker.js
│   └── package.json
├── package.json           # ルート package.json
└── README.md
```

## 🔧 API エンドポイント

### POST /api/upload
動画ファイルのアップロード

**Request:**
- `video`: 動画ファイル (FormData)
- `topic`: 手順書のテーマ (String, 任意)

**Response:**
```json
{
  "success": true,
  "videoId": "unique-id",
  "filename": "video.mp4"
}
```

### POST /api/process
動画からフレームを抽出

**Request:**
```json
{
  "videoId": "unique-id",
  "filename": "video.mp4",
  "topic": "手順書のテーマ (任意)"
}
```

**Response:**
```json
{
  "success": true,
  "frameCount": 10,
  "frames": ["videoId/frame-0001.jpg", ...]
}
```

### POST /api/generate-manual
Gemini AIで手順書を生成

**Request:**
```json
{
  "videoId": "unique-id",
  "frames": ["frame1.jpg", "frame2.jpg"],
  "topic": "手順書のテーマ (任意)"
}
```

**Response:**
```json
{
  "success": true,
  "manual": {
    "title": "手順書タイトル",
    "overview": "概要",
    "requirements": ["必要なもの"],
    "steps": [
      {
        "stepNumber": 1,
        "title": "ステップタイトル",
        "description": "説明",
        "imageIndices": [1, 2],
        "notes": "注意点"
      }
    ],
    "frames": [...]
  }
}
```

### POST /api/refine-manual (NEW! ✨)
既存の手順書をユーザーの指示に基づいて修正

**Request:**
```json
{
  "manual": {
    "title": "既存の手順書タイトル",
    "overview": "既存の概要",
    "requirements": ["既存の必要なもの"],
    "steps": [...],
    "frames": [...]
  },
  "instruction": "ステップ3をもっと詳しく説明して"
}
```

**Response:**
```json
{
  "success": true,
  "manual": {
    "title": "修正された手順書タイトル",
    "overview": "修正された概要",
    "requirements": ["修正された必要なもの"],
    "steps": [...],
    "frames": [...]
  }
}
```

## 🌐 本番環境へのデプロイ

### Heroku へのデプロイ例

1. Herokuアカウント作成とCLIインストール
2. アプリケーション作成：
```bash
heroku create your-app-name
```

3. 環境変数の設定：
```bash
heroku config:set GEMINI_API_KEY=your_api_key
```

4. Buildpackの追加（FFmpeg用）：
```bash
heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
heroku buildpacks:add --index 2 heroku/nodejs
```

5. デプロイ：
```bash
git push heroku main
```

## 🐛 トラブルシューティング

### 動画のアップロードが失敗する

- ファイルサイズが100MBを超えていないか確認
- 対応フォーマット: mp4, avi, mov, mkv, webm, m4v, 3gp

### カメラにアクセスできない

- ブラウザのカメラ権限を確認
- HTTPSまたはlocalhostで実行されているか確認
- iOSの場合はSafariを使用

### Gemini APIエラー

- APIキーが正しく設定されているか確認
- APIの使用制限を超えていないか確認
- [Google AI Studio](https://makersuite.google.com/)でAPIの状態を確認

### FFmpegエラー

- FFmpegが正しくインストールされているか確認：
```bash
ffmpeg -version
```

## 📄 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 サポート

問題が発生した場合は、GitHubのIssuesでお知らせください。

---

**Powered by Google Gemini AI** 🤖
