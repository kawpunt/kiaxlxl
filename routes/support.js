const express = require('express');
const router = express.Router();

// In-memory chat sessions (works in demo mode). For production, persist in DB.
const sessions = new Map(); // id -> session

function createId() {
  return 'sess_' + Math.random().toString(36).slice(2, 10);
}

// Very simple rule-based auto replies (reuses keywords similar to routes/chatbot.js)
function autoReply(text) {
  const msg = (text || '').toLowerCase();
  if (/(hello|hi|hey|good\s?(morning|afternoon|evening))/.test(msg)) {
    return 'Hi! How can we help with Meta Ads, SEO, funnels, or sales consulting today?';
  }
  if (/(service|offer|what do you do)/.test(msg)) {
    return 'We offer Meta Ads management, SEO optimization, sales funnel optimization, and sales consulting. Which are you interested in?';
  }
  if (/(price|pricing|cost|how much)/.test(msg)) {
    return 'Pricing depends on scope. Typical ranges: Meta Ads from $1,500/mo, SEO from $1,200/mo, Funnels from $5,000 project, Consulting from $150/hr. Would you like a free strategy call?';
  }
  if (/(start|get started|free call|consultation)/.test(msg)) {
    return 'Great! Please share your name, email, and the service you need. We can start within 48 hours after kickoff.';
  }
  if (/(seo)/.test(msg)) return 'For SEO we handle audits, keyword strategy, content optimization, and link building.';
  if (/(meta|facebook|instagram)/.test(msg)) return 'For Meta Ads we handle strategy, creatives, targeting, and optimization for ROI.';
  if (/(funnel)/.test(msg)) return 'For funnels we design high‑converting pages, automation, and tracking to maximize conversions.';
  if (/(sales|close|closing)/.test(msg)) return 'Our sales consulting improves process, objection handling, and closing rates.';
  return "I'm here to help. Could you share a bit more about your goals?";
}

// Create/start a support session
// POST /api/support/start { name?, email? }
router.post('/start', (req, res) => {
  const { name = 'Visitor', email = '' } = req.body || {};
  const id = createId();
  const now = new Date().toISOString();
  const session = {
    id,
    name,
    email,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    assignedTo: null,
    messages: [
      { sender: 'system', text: 'Session created', timestamp: now }
    ]
  };
  sessions.set(id, session);
  res.json({ success: true, session });
});

// Send a message in a session
// POST /api/support/message { sessionId, sender: 'user'|'admin', message }
router.post('/message', (req, res) => {
  const { sessionId, sender, message } = req.body || {};
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({ success: false, error: 'Invalid session' });
  }
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message required' });
  }
  const sess = sessions.get(sessionId);
  const now = new Date().toISOString();
  sess.messages.push({ sender, text: message, timestamp: now });
  sess.updatedAt = now;

  let bot = null;
  if (sender === 'user') {
    bot = autoReply(message);
    sess.messages.push({ sender: 'bot', text: bot, timestamp: new Date().toISOString() });
  }

  res.json({ success: true, session: { id: sess.id, status: sess.status }, bot });
});

// List sessions (admin)
router.get('/sessions', (req, res) => {
  const list = Array.from(sessions.values()).map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    status: s.status,
    updatedAt: s.updatedAt,
  })).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ success: true, sessions: list });
});

// Get session with messages
router.get('/sessions/:id', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, session: s });
});

// Assign/close
router.post('/sessions/:id/assign', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ success: false, error: 'Not found' });
  s.assignedTo = req.body.assignedTo || null;
  s.updatedAt = new Date().toISOString();
  res.json({ success: true });
});

router.post('/sessions/:id/close', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ success: false, error: 'Not found' });
  s.status = 'closed';
  s.updatedAt = new Date().toISOString();
  res.json({ success: true });
});

module.exports = router;

