const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
  try {
    console.log("Checking API Key: ", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: 'Respond with the word "SUCCESS" if you receive this message.'
    });
    console.log("Gemini Response:", response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}
test();
