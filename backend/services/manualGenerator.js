const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Convert image file to base64 data
 * @param {string} imagePath - Path to the image file
 * @returns {Object} Image data object for Gemini API
 */
function fileToGenerativePart(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const base64Data = imageData.toString('base64');
  const mimeType = 'image/jpeg';

  return {
    inlineData: {
      data: base64Data,
      mimeType
    }
  };
}

/**
 * Generate step-by-step manual from video frames using Gemini API
 * @param {Array} frames - Array of frame filenames
 * @param {string} topic - Optional description of the manual topic
 * @param {string} framesDir - Directory containing the frames
 * @returns {Promise<Object>} Generated manual with steps
 */
async function generateManual(frames, topic, framesDir) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    // Use Gemini 2.0 Flash Exp model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Prepare image parts for all frames
    const imageParts = frames.map(frame => {
      const fullPath = path.join(framesDir, frame);
      return fileToGenerativePart(fullPath);
    });

    // Create prompt for manual generation (with or without topic)
    const topicSection = topic
      ? `User provided topic: ${topic}\n\n`
      : `First, analyze the video frames and determine what activity or process is being demonstrated.\n\n`;

    const prompt = `You are an expert technical writer creating step-by-step instruction manuals.

${topicSection}I have provided you with ${frames.length} sequential frames extracted from a video demonstration.

Please analyze these frames carefully and create a detailed step-by-step manual in Japanese with the following structure:

1. タイトル (Title) - A clear, descriptive title for this manual based on what you observe in the video
2. 概要 (Overview) - Brief overview of what this manual will teach
3. 必要なもの (Requirements) - List any tools, materials, or prerequisites needed
4. 手順 (Steps) - Detailed step-by-step instructions

For each step:
- ステップ番号 (Step number and title)
- 説明 (Detailed explanation of what to do)
- 対応する画像番号 (Which frame number(s) correspond to this step, using 1-based indexing)
- 注意点 (Any important notes, tips, or warnings)

Please provide the response in JSON format with the following structure:
{
  "title": "マニュアルのタイトル",
  "overview": "概要説明",
  "requirements": ["必要なもの1", "必要なもの2"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "ステップタイトル",
      "description": "詳細な説明",
      "imageIndices": [1, 2],
      "notes": "注意点やヒント"
    }
  ]
}

Make sure to:
- Carefully observe what activity is being demonstrated in the frames
- Analyze the frames chronologically
- Identify key actions and transitions
- Group related frames into logical steps
- Provide clear, actionable instructions
- Include safety warnings if applicable
- Use professional but friendly language in Japanese
- Be specific and detailed in your descriptions

Now, please create the manual:`;

    // Generate content with all images
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let manual;
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      manual = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse JSON response, using raw text');
      // If JSON parsing fails, create a structured response from the text
      manual = {
        title: topic || '動画から生成された手順書',
        overview: '動画から生成された手順書',
        requirements: [],
        steps: [{
          stepNumber: 1,
          title: '手順の詳細',
          description: text,
          imageIndices: frames.map((_, i) => i + 1),
          notes: ''
        }],
        rawResponse: text
      };
    }

    // Add frame URLs to the manual
    manual.frames = frames.map((frame, index) => ({
      index: index + 1,
      url: `/frames/${frame}`,
      filename: frame
    }));

    return manual;

  } catch (error) {
    console.error('Error generating manual:', error);
    throw new Error(`Failed to generate manual: ${error.message}`);
  }
}

/**
 * Refine existing manual based on user instructions
 * @param {Object} currentManual - The current manual object
 * @param {string} refinementInstruction - User's instruction for refinement
 * @param {string} framesDir - Directory containing the frames
 * @returns {Promise<Object>} Refined manual with steps
 */
async function refineManual(currentManual, refinementInstruction, framesDir) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    // Use Gemini 2.0 Flash Exp model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Prepare image parts for all frames
    const imageParts = currentManual.frames.map(frame => {
      const fullPath = path.join(framesDir, frame.filename);
      return fileToGenerativePart(fullPath);
    });

    // Create prompt for manual refinement
    const prompt = `You are an expert technical writer refining step-by-step instruction manuals.

Current manual (in JSON format):
${JSON.stringify({
  title: currentManual.title,
  overview: currentManual.overview,
  requirements: currentManual.requirements,
  steps: currentManual.steps
}, null, 2)}

User's refinement instruction:
"${refinementInstruction}"

I have provided you with ${currentManual.frames.length} frames from the original video for reference.

Please refine the manual according to the user's instruction while maintaining the same JSON structure:
{
  "title": "マニュアルのタイトル",
  "overview": "概要説明",
  "requirements": ["必要なもの1", "必要なもの2"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "ステップタイトル",
      "description": "詳細な説明",
      "imageIndices": [1, 2],
      "notes": "注意点やヒント"
    }
  ]
}

Important guidelines:
- Carefully interpret the user's instruction
- Make only the changes requested by the user
- Maintain the quality and clarity of the manual
- Keep the JSON structure intact
- Reference the frames when needed to ensure accuracy
- Use professional but friendly language in Japanese
- If the instruction is unclear, make reasonable improvements

Please provide the refined manual in JSON format:`;

    // Generate refined content
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let refinedManual;
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      refinedManual = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse JSON response, returning original manual');
      // If parsing fails, return the original manual
      refinedManual = {
        title: currentManual.title,
        overview: currentManual.overview,
        requirements: currentManual.requirements,
        steps: currentManual.steps,
        parseError: true,
        rawResponse: text
      };
    }

    // Add frame URLs to the refined manual
    refinedManual.frames = currentManual.frames;

    return refinedManual;

  } catch (error) {
    console.error('Error refining manual:', error);
    throw new Error(`Failed to refine manual: ${error.message}`);
  }
}

/**
 * Generate a summary of a single frame
 * @param {string} framePath - Path to the frame image
 * @param {string} context - Context or question about the frame
 * @returns {Promise<string>} Description of the frame
 */
async function analyzeFrame(framePath, context = 'Describe what is happening in this image') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const imagePart = fileToGenerativePart(framePath);

    const result = await model.generateContent([context, imagePart]);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Error analyzing frame:', error);
    throw new Error(`Failed to analyze frame: ${error.message}`);
  }
}

module.exports = {
  generateManual,
  refineManual,
  analyzeFrame
};
