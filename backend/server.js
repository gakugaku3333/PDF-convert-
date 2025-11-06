const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { processVideo } = require('./services/videoProcessor');
const { generateManual } = require('./services/manualGenerator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const framesDir = path.join(__dirname, 'frames');
const outputDir = path.join(__dirname, 'output');

[uploadsDir, framesDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files
app.use('/frames', express.static(framesDir));
app.use('/output', express.static(outputDir));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, 'public');
  app.use(express.static(frontendPath));
}

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|webm|m4v|3gp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('video/');

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload and process video endpoint
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic description is required' });
    }

    const videoPath = req.file.path;
    const videoId = path.parse(req.file.filename).name;

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      videoId: videoId,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process video and extract frames
app.post('/api/process', async (req, res) => {
  try {
    const { videoId, filename, topic } = req.body;

    if (!videoId || !filename || !topic) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const videoPath = path.join(uploadsDir, filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video file not found' });
    }

    // Extract frames from video
    console.log('Extracting frames from video...');
    const frames = await processVideo(videoPath, videoId, framesDir);

    if (!frames || frames.length === 0) {
      return res.status(500).json({ error: 'Failed to extract frames from video' });
    }

    res.json({
      success: true,
      message: 'Frames extracted successfully',
      frameCount: frames.length,
      frames: frames
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate manual from frames
app.post('/api/generate-manual', async (req, res) => {
  try {
    const { videoId, frames, topic } = req.body;

    if (!videoId || !frames || !topic) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Generating manual with Gemini API...');
    const manual = await generateManual(frames, topic, framesDir);

    res.json({
      success: true,
      manual: manual
    });

  } catch (error) {
    console.error('Manual generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cleanup old files
app.delete('/api/cleanup/:videoId', (req, res) => {
  try {
    const { videoId } = req.params;

    // Delete uploaded video
    const videoFiles = fs.readdirSync(uploadsDir).filter(f => f.startsWith(videoId));
    videoFiles.forEach(file => {
      fs.unlinkSync(path.join(uploadsDir, file));
    });

    // Delete extracted frames
    const frameFiles = fs.readdirSync(framesDir).filter(f => f.startsWith(videoId));
    frameFiles.forEach(file => {
      fs.unlinkSync(path.join(framesDir, file));
    });

    res.json({ success: true, message: 'Cleanup completed' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Upload directory: ${uploadsDir}`);
  console.log(`Frames directory: ${framesDir}`);
  console.log(`Output directory: ${outputDir}`);
});

module.exports = app;
