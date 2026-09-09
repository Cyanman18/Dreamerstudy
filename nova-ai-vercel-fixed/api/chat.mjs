import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured in Vercel." });
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const clean = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-30);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are Nova, a helpful, concise AI assistant. Use clear formatting. " +
        "Be honest when you are unsure. Do not claim to have performed actions you did not perform.",
      input: clean.map(m => ({ role: m.role, content: m.content }))
    });

    return res.status(200).json({ text: response.output_text || "I couldn't generate a response." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error?.message || "AI request failed." });
  }
}
