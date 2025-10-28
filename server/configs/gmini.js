import { GoogleGenAI } from "@google/genai";

// Sanitize GEMINI_API_KEY (strip surrounding quotes if present)
const rawGeminiKey = (process.env.GEMINI_API_KEY || '').toString().trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
const ai = new GoogleGenAI({ apiKey: rawGeminiKey });

/**
 * Generate text using Google Gemini, with safe fallbacks.
 * If Gemini returns an error (quota or otherwise), we will attempt:
 *  1) Call OpenAI (if OPENAI_API_KEY present) as a fallback
 *  2) Return a deterministic local fallback string
 */
async function main(prompt) {
  try {
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    // Prefer common text properties
    if (!response) throw new Error('Empty response from Gemini API');
    if (typeof response.text === 'string' && response.text.trim()) return response.text;
    if (typeof response.output_text === 'string' && response.output_text.trim()) return response.output_text;
    if (response?.content) {
      if (typeof response.content === 'string' && response.content.trim()) return response.content;
      try { return JSON.stringify(response.content); } catch {}
    }
    // Last resort stringify
    return JSON.stringify(response);
  } catch (err) {
    // Annotate error
    const e = new Error(err?.message || 'Gemini API error');
    e.original = err;
    // Try to infer status code
    const code = err?.original?.error?.code || err?.original?.status || err?.status || err?.code;
    if (code) {
      const n = Number(code);
      if (!isNaN(n)) e.statusCode = n;
    }
    if (!e.statusCode && /RATE_LIMIT|quota|QUOTA_EXCEEDED|RESOURCE_EXHAUSTED/i.test(err?.message || '')) e.statusCode = 429;

    // Fallback: try OpenAI if available
    try {
      const OPENAI_KEY = (process.env.OPENAI_API_KEY || '').toString().trim();
      if (OPENAI_KEY) {
        const fetch = globalThis.fetch || (await import('node-fetch')).default;
        const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 800 })
        });

        if (openaiResp.ok) {
          const data = await openaiResp.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text && typeof text === 'string') return text;
        } else {
          try { const bodyText = await openaiResp.text(); console.error('OpenAI fallback non-ok:', openaiResp.status, bodyText); } catch {};
        }
      }
    } catch (openaiErr) {
      console.error('OpenAI fallback error:', openaiErr);
    }

    // Deterministic local fallback
    try {
      const title = (String(prompt || '') || 'Untitled Topic').split('\n')[0].slice(0, 80) || 'Untitled Topic';
      const fallback = `# ${title}\n\n` +
        `Introduction:\nA short introduction about ${title}.\n\n` +
        `Main points:\n1. Key idea one about ${title}.\n2. Key idea two about ${title}.\n3. Key idea three about ${title}.\n\n` +
        `Conclusion:\nA short conclusion about ${title}.`;
      return fallback;
    } catch (finalErr) {
      console.error('Fallback generation failed:', finalErr);
      throw e; // give up — rethrow original annotated error
    }
  }
}

export default main;