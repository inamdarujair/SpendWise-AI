require('dotenv').config();

async function test() {
  console.log("Checking API Key: ", process.env.OPENROUTER_API_KEY ? "Present" : "Missing");
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [{ role: "user", content: "Respond with the word SUCCESS" }]
      })
    });
    const data = await response.json();
    console.log("OpenRouter Response:", data.choices?.[0]?.message?.content);
  } catch (error) {
    console.error("OpenRouter Error:", error);
  }
}
test();
