import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Function to summarize email into 1 sentence
export async function getSummary(subject = '', content = '') {
  const prompt = `
Summarize the following email in 2 sentence:

Subject: ${subject}

Body:
${content}
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("❌ Error generating summary:", error.message);
    // return "Summary not available.";
    return error
  }
}
