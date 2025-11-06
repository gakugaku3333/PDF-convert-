const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

/**
 * Extract key frames from video
 * @param {string} videoPath - Path to the video file
 * @param {string} videoId - Unique identifier for the video
 * @param {string} outputDir - Directory to save extracted frames
 * @returns {Promise<Array>} Array of frame filenames
 */
async function processVideo(videoPath, videoId, outputDir) {
  return new Promise((resolve, reject) => {
    const videoOutputDir = path.join(outputDir, videoId);

    // Create output directory for this video
    if (!fs.existsSync(videoOutputDir)) {
      fs.mkdirSync(videoOutputDir, { recursive: true });
    }

    const outputPattern = path.join(videoOutputDir, 'frame-%04d.jpg');

    // Get video duration first
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to probe video: ${err.message}`));
      }

      const duration = metadata.format.duration;
      console.log(`Video duration: ${duration} seconds`);

      // Calculate frame extraction rate
      // Extract a frame every N seconds, or up to 15 frames total
      const maxFrames = 15;
      const minInterval = 2; // Minimum 2 seconds between frames
      const frameInterval = Math.max(minInterval, Math.floor(duration / maxFrames));

      console.log(`Extracting frames every ${frameInterval} seconds...`);

      // Extract frames
      ffmpeg(videoPath)
        .screenshots({
          count: Math.min(maxFrames, Math.ceil(duration / frameInterval)),
          filename: 'frame-%04d.jpg',
          folder: videoOutputDir,
          size: '1280x720' // HD resolution
        })
        .on('end', async () => {
          try {
            // Get list of extracted frames
            const files = await readdir(videoOutputDir);
            const frames = files
              .filter(f => f.endsWith('.jpg'))
              .sort()
              .map(f => `${videoId}/${f}`);

            console.log(`Successfully extracted ${frames.length} frames`);
            resolve(frames);
          } catch (error) {
            reject(new Error(`Failed to read extracted frames: ${error.message}`));
          }
        })
        .on('error', (error) => {
          reject(new Error(`FFmpeg error: ${error.message}`));
        });
    });
  });
}

/**
 * Get video metadata
 * @param {string} videoPath - Path to the video file
 * @returns {Promise<Object>} Video metadata
 */
async function getVideoMetadata(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(new Error(`Failed to get video metadata: ${err.message}`));
      } else {
        resolve({
          duration: metadata.format.duration,
          size: metadata.format.size,
          bitRate: metadata.format.bit_rate,
          videoCodec: metadata.streams[0]?.codec_name,
          width: metadata.streams[0]?.width,
          height: metadata.streams[0]?.height,
          fps: eval(metadata.streams[0]?.r_frame_rate) // e.g., "30/1" -> 30
        });
      }
    });
  });
}

/**
 * Extract a single frame at a specific timestamp
 * @param {string} videoPath - Path to the video file
 * @param {number} timestamp - Timestamp in seconds
 * @param {string} outputPath - Output path for the frame
 * @returns {Promise<string>} Path to extracted frame
 */
async function extractFrameAtTime(videoPath, timestamp, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '1280x720'
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (error) => {
        reject(new Error(`Failed to extract frame: ${error.message}`));
      });
  });
}

module.exports = {
  processVideo,
  getVideoMetadata,
  extractFrameAtTime
};
