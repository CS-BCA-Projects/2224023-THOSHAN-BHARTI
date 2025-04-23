const fetch = require('node-fetch');
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const MODEL = 'google/flan-t5-base'; // fast and works well

async function generateMoodRecap(logText) {
  const prompt = `A person says: "${logText}"\nGive a kind, short, calming message with gentle advice or an uplifting quote.`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  });

  const result = await response.json();

  const output = Array.isArray(result)
    ? result[0]?.generated_text?.trim()
    : result.generated_text?.trim();

  return output || "Sorry, I'm having a quiet moment 🌿";
}

module.exports = { generateMoodRecap };
