import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { mock = false } = req.body || {};
  if (mock) {
    return res.status(200).json({
      after: { image_url: "https://via.placeholder.com/1920x1080?text=Version+améliorée" }
    });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt: "Refonte moderne d'une landing page en dark mode, CTA rouge",
      size: "1920x1080"
    });
    res.status(200).json({ after: { image_url: img.data[0].url } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
