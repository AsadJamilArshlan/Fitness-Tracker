const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @route   POST /api/image-analysis
exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No image uploaded' } });
    }

    const filePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `Analyze this image and identify the food. Estimate its calories.
      Respond ONLY in valid JSON format like this:
      {"name": "Food Name", "calories": 150}
      Do not include markdown or any other text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [filePart, prompt],
    });

    let rawText = response.text.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    
    const result = JSON.parse(rawText);

    res.json({ result });
  } catch (error) {
    console.error('Image analysis error details:', error.message, error.stack);
    res.status(500).json({ error: { message: 'Failed to analyze image: ' + error.message } });
  }
};
