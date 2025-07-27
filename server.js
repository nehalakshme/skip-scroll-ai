// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Setup for OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  const prompt = `
You are a legal assistant. Summarize the following Terms & Conditions or Privacy Policy in plain, easy-to-understand language.

1. Clearly list all key points — do not limit to 5–7 if there are more important clauses.
2. Emphasize areas that involve:
   - Collection or sharing of personal data
   - Automatic renewals, payments, or cancellations
   - Legal obligations, restrictions, or waivers of rights
3. Avoid emojis or casual language.
4. Present the summary in clean bullet points or short paragraphs.
5. If any clauses appear overly broad, vague, or potentially harmful to the user, highlight them.

Here is the document:
${text}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // If you're on free tier or don't have GPT-4 access

      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
