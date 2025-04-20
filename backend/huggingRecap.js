const fetch = require('node-fetch');

const HF_TOKEN = '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'; // or use process.env
const MODEL = 'tiiuae/falcon-7b-instruct';

async function generateMoodRecap(logText) {
  const prompt = `You are a gentle and empathetic partner reading this journal:\n\n${logText}\n\nPlease respond with comforting words, emotional validation, and encouragement — like a supportive friend. Avoid formal tone or summaries.`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        temperature: 0.8,
        max_new_tokens: 200
      }
    })
  });

  const data = await response.json();
  return data?.[0]?.generated_text?.replace(prompt, '').trim() || "You're doing your best, and that matters. Keep going. 🌿";
}

module.exports = { generateMoodRecap };
