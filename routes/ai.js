const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Ensure API key exists
if (!process.env.OPENAI_API_KEY) {
  console.warn('[AI] OPENAI_API_KEY missing. Set it in your environment to enable AI chat.');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai/chat
// body: { message: string, history?: [{role, content}] }
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // System prompt tailored to your media services
    const system = `You are JYS Media's helpful assistant. You speak concisely and help users with:
    - Meta Ads (Facebook/Instagram) strategy, setup, optimization
    - SEO optimization (technical, content, links)
    - Sales funnels (landing pages, CRO, automation)
    - Sales consulting (objections, negotiation, closing)
    Always invite users to book a free strategy call for precise pricing.`;

    const messages = [
      { role: 'system', content: system },
      ...history.filter(m => m.role && m.content).slice(-10),
      { role: 'user', content: message }
    ];

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.6,
      max_tokens: 300
    });

    const content = resp.choices?.[0]?.message?.content?.trim() || "I'm here to help. Could you clarify your question?";
    res.json({ success: true, reply: content });
  } catch (err) {
    console.error('[AI] chat error', err);
    res.status(500).json({ success: false, error: 'AI service error' });
  }
});

module.exports = router;

