# 📹 Video to Manual Generator

A mobile-friendly web application that automatically generates step-by-step instruction manuals from videos using Google Gemini AI. Works on both iPhone and Android devices.

## ✨ Features

- 📱 **Mobile-Friendly**: Responsive design for iPhone & Android
- 🎥 **Video Recording**: Record videos directly in the browser
- 📤 **File Upload**: Upload existing video files
- 🤖 **AI Analysis**: High-accuracy content analysis using Gemini API
- 📝 **Auto-Generate Manuals**: Create detailed step-by-step instructions
- 🖼️ **Images Included**: Automatically associate images with each step
- 🖨️ **Print & Download**: Export manuals as text or print them
- 🌐 **PWA Support**: Install as an app on your home screen

## 🛠️ Tech Stack

### Frontend
- React 18
- CSS3 (Mobile-first design)
- Axios
- PWA (Progressive Web App)

### Backend
- Node.js
- Express
- Multer (file upload)
- FFmpeg (video processing)
- Google Gemini API (AI analysis)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- FFmpeg
- Gemini API Key

### Installing FFmpeg

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
1. Download from [FFmpeg official website](https://ffmpeg.org/download.html)
2. Add to PATH environment variable

## 🚀 Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PDF-convert-
```

### 2. Install Dependencies

```bash
# Install all dependencies at once
npm run install-all
```

Or install individually:

```bash
# Root directory
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
MAX_FILE_SIZE=100mb
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env` file

## 🏃 Running the Application

### Development Mode

From the root directory:

```bash
npm run dev
```

Or run separately:

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm start
```

Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 How to Use

### 1. Enter Topic

Describe what the manual is about.

Examples:
- "How to make coffee"
- "Smartphone initial setup"
- "Printer ink replacement"

### 2. Prepare Video

Choose one method:

#### 📹 Record in Browser
1. Tap "Record Video"
2. Allow camera access
3. Start recording (demonstrate the procedure)
4. Tap "Stop Recording"

#### 📁 Select File
1. Tap "Select from Files"
2. Choose a video file from your device

### 3. Generate Manual

1. Tap "Generate Manual"
2. AI analyzes the video (usually 30s-1min)
3. Review the generated manual

### 4. Use the Manual

- 📄 **View**: Display steps with images
- 🖨️ **Print**: Print the manual
- 💾 **Download**: Save as text file
- 🔄 **New**: Create a new manual

## 📸 Recording Tips

For best results:

- ✅ Demonstrate each step slowly and clearly
- ✅ Record in a well-lit area
- ✅ Pause briefly at important points
- ✅ Use landscape orientation
- ✅ Keep videos 2-5 minutes long
- ❌ Avoid dark locations and shaky footage

## 🏗️ Project Structure

```
PDF-convert-/
├── backend/
│   ├── services/
│   │   ├── videoProcessor.js
│   │   └── manualGenerator.js
│   ├── uploads/
│   ├── frames/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### POST /api/upload
Upload video file

### POST /api/process
Extract frames from video

### POST /api/generate-manual
Generate manual using Gemini AI

## 🐛 Troubleshooting

### Video upload fails
- Check file size (max 100MB)
- Supported formats: mp4, avi, mov, mkv, webm, m4v, 3gp

### Cannot access camera
- Check browser camera permissions
- Ensure using HTTPS or localhost
- On iOS, use Safari browser

### Gemini API errors
- Verify API key is correct
- Check API usage limits
- Visit [Google AI Studio](https://makersuite.google.com/) to check API status

### FFmpeg errors
- Verify FFmpeg installation:
```bash
ffmpeg -version
```

## 📄 License

MIT License

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

**Powered by Google Gemini AI** 🤖
