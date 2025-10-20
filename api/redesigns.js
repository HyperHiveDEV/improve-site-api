import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, mock = false } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL manquante" });

  if (mock) {
    return res.status(200).json({
      id: "mock_123",
      analysis: {
        issues: [
          { priority: "high", description: "CTA peu visible", solution: "Augmenter le contraste" },
          { priority: "medium", description: "Texte trop long", solution: "Raccourcir le hero" }
        ]
      }
    });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Analyse UX/UI/SEO du site ${url}. Retourne un JSON avec 3 problèmes et solutions.`;
    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }]
    });
    res.status(200).json(JSON.parse(r.choices[0].message.content));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
