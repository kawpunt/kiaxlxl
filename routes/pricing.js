const express = require('express');
const router = express.Router();
let OpenAI;
try { OpenAI = require('openai').OpenAI || require('openai'); } catch (_) { OpenAI = null; }

// Base price book (USD cents) aligned with checkout PRODUCTS
const BASE_PRODUCTS = {
  'meta-ads': { name: 'Meta Ads Setup', amount: 150000, currency: 'usd' },
  'seo': { name: 'SEO Monthly Plan', amount: 120000, currency: 'usd' },
  'funnels': { name: 'Sales Funnel Build', amount: 500000, currency: 'usd' },
  'consulting': { name: 'Sales Consulting (Starter)', amount: 15000, currency: 'usd' }
};

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function fallbackEstimate(productId, inputs = {}){
  const base = BASE_PRODUCTS[productId];
  if (!base) return null;
  let amount = base.amount;
  const {
    urgencyDays,
    scope = 'standard',
    complexity = 'medium',
    adBudgetUsd,
    keywordsCount,
    pagesCount,
    hours,
    currentTraffic,
    regions,
    languages,
    industry,
    notes
  } = inputs;
  // Simple heuristics
  if (scope === 'lite') amount = Math.round(amount * 0.7);
  if (scope === 'pro') amount = Math.round(amount * 1.25);
  if (complexity === 'low') amount = Math.round(amount * 0.9);
  if (complexity === 'high') amount = Math.round(amount * 1.35);
  if (typeof urgencyDays === 'number' && urgencyDays > 0) {
    if (urgencyDays <= 3) amount = Math.round(amount * 1.25);
    else if (urgencyDays <= 7) amount = Math.round(amount * 1.1);
  }

  const breakdown = [`Base: $${(base.amount/100).toFixed(2)}`];

  // Product-specific adjustments
  switch (productId) {
    case 'meta-ads': {
      const budget = Number(adBudgetUsd || 0);
      if (budget > 0) {
        const factor = clamp(budget / 10000, 0.05, 0.35); // 5% .. 35% uplift
        amount = Math.round(amount * (1 + factor));
        breakdown.push(`Budget factor (+${Math.round(factor*100)}%) for $${budget.toFixed(0)}/mo spend`);
      }
      break;
    }
    case 'seo': {
      const kw = Number(keywordsCount || 0);
      if (kw > 10) {
        const extra = clamp((kw - 10) * 0.02, 0, 0.5); // up to +50%
        amount = Math.round(amount * (1 + extra));
        breakdown.push(`Keywords (+${Math.round(extra*100)}%) for ${kw} targets`);
      }
      const traffic = Number(currentTraffic || 0);
      if (traffic < 500 && traffic >= 0) {
        amount = Math.round(amount * 1.1);
        breakdown.push('Low baseline traffic (+10%)');
      }
      break;
    }
    case 'funnels': {
      const pages = Math.max(0, Number(pagesCount || 0));
      const extraPages = Math.max(0, pages - 3);
      if (extraPages > 0) {
        const add = extraPages * 50000; // $500/page
        amount += add;
        breakdown.push(`Extra pages (+$${(add/100).toFixed(0)}) for ${extraPages} page(s)`);
      }
      break;
    }
    case 'consulting': {
      const h = Math.max(0, Number(hours || 0));
      if (h > 0) {
        amount = Math.max(amount, h * 15000); // $150/hr
        breakdown.push(`Hours: ${h}h @ $150/hr`);
      }
      break;
    }
  }

  const reg = Number(regions || 0);
  if (reg > 1) {
    const extra = clamp((reg - 1) * 0.05, 0, 0.3);
    amount = Math.round(amount * (1 + extra));
    breakdown.push(`Regions (+${Math.round(extra*100)}%) for ${reg} region(s)`);
  }
  const lang = Number(languages || 0);
  if (lang > 1) {
    const extra = clamp((lang - 1) * 0.05, 0, 0.25);
    amount = Math.round(amount * (1 + extra));
    breakdown.push(`Languages (+${Math.round(extra*100)}%) for ${lang} lang(s)`);
  }

  if (industry && /health|finance|medical|bank|insur/i.test(industry)) {
    amount = Math.round(amount * 1.12);
    breakdown.push('Regulated industry (+12%)');
  }
  return {
    name: base.name,
    currency: base.currency,
    amount,
    breakdown: [
      ...breakdown,
      scope !== 'standard' ? `Scope (${scope}) adjustment` : null,
      complexity !== 'medium' ? `Complexity (${complexity}) adjustment` : null,
      typeof urgencyDays === 'number' ? `Urgency (${urgencyDays} days) adjustment` : null
    ].filter(Boolean),
    assumptions: [ 'Estimate uses heuristics when AI is unavailable; final quote may vary.', notes || '' ].filter(Boolean),
    confidence: 0.6
  };
}

router.post('/estimate', async (req, res) => {
  try {
    const { productId, inputs = {} } = req.body || {};
    if (!BASE_PRODUCTS[productId]) {
      return res.status(400).json({ success: false, error: 'Invalid product' });
    }

    // If no API key or SDK, return fallback heuristic
    if (!process.env.OPENAI_API_KEY || !OpenAI) {
      const est = fallbackEstimate(productId, inputs);
      return res.json({ success: true, estimate: est, source: 'fallback' });
    }

    // AI-powered estimate in JSON
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const base = BASE_PRODUCTS[productId];
    const prompt = `You are a pricing assistant for a digital marketing agency. 
Return a single JSON object with fields: amount (integer, USD cents), currency ('usd'), name (string), breakdown (array of strings), assumptions (array of strings), confidence (0..1).
Consider this base product and context: ${JSON.stringify(base)}. Additional inputs: ${JSON.stringify(inputs)}.
Adjust price using reasonable ranges for scope, complexity, and urgency. Make sure the JSON is the only output.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [ { role: 'system', content: 'Return only strict JSON.' }, { role: 'user', content: prompt } ]
    });

    const content = completion.choices?.[0]?.message?.content || '';
    let json;
    try { json = JSON.parse(content); }
    catch (_e) {
      // Try to extract JSON substring
      const m = content.match(/\{[\s\S]*\}/);
      if (m) json = JSON.parse(m[0]);
    }
    if (!json || typeof json.amount !== 'number') {
      const est = fallbackEstimate(productId, inputs);
      return res.json({ success: true, estimate: est, source: 'fallback' });
    }
    return res.json({ success: true, estimate: json, source: 'ai' });
  } catch (err) {
    console.error('[Pricing] estimate error', err);
    const est = fallbackEstimate((req.body||{}).productId, (req.body||{}).inputs);
    if (est) return res.json({ success: true, estimate: est, source: 'fallback' });
    return res.status(500).json({ success: false, error: 'Pricing service error' });
  }
});

module.exports = router;


