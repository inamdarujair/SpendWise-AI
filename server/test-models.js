const https = require('https');
require('dotenv').config();

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`, (resp) => {
  let data = '';
  resp.on('data', (chunk) => data += chunk);
  resp.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        console.log("Available models:", parsed.models.map(m => m.name));
      } else {
        console.log("Response:", parsed);
      }
    } catch (e) {
      console.log("Error parsing:", e);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
