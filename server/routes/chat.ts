import express from 'express';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const chatHandler = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found in environment variables');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    console.log('Sending request to OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3001',
        'Content-Type': 'application/json',
        'X-Title': 'Chat App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log('OpenRouter API response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('OpenRouter API error:', data);
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from AI service');
    }

    const aiResponse = data.choices[0].message.content.trim();
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.post('/chat', chatHandler);

export default router;
