const fetch = require('node-fetch');

HUGGINGFACE_API_KEY='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';
const MODEL = 'tiiuae/falcon-7b-instruct';

async function generateMoodRecap(logText) {
  const prompt = `
You are an emotionally intelligent and compassionate AI companion.

A human just shared their mood:
"${logText}"

Reply kindly like a real friend:
- Use empathy and humor
- Optionally include a calming poem, inspiring quote, or light story
- Avoid repeating the user input
- Avoid robotic tone
- Keep it short and sincere

AI Companion:`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        temperature: 0.85,
        max_new_tokens: 180,
        top_p: 0.9,
        do_sample: true
      }
    })
  });

  const data = await response.json();

  // Extract only what comes after "AI Companion:"
  const fullOutput = data?.[0]?.generated_text || '';
  const aiReply = fullOutput.includes("AI Companion:")
    ? fullOutput.split("AI Companion:")[1].trim()
    : fullOutput.trim();

  return aiReply || "I'm here for you — you matter 🌿";
}

module.exports = { generateMoodRecap };
