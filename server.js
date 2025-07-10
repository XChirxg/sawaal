const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const app = express();

app.use(express.json({ limit: "2mb" }));

const BOT_TOKEN = "7679570224:AAHCRFPDMHBsDQ9VPOJDl4e6iea06qKTCBU";
const CHANNEL_ID = "@sawaal_app";

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.post("/upload", async (req, res) => {
  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const topic = data.topic || "Untitled";
    const author = data.author || "Anonymous";

    // Send basic message first
    const summary = `🧠 *New Community Quiz!*\n📌 Topic: *${topic}*\n👤 Author: *${author}*`;
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHANNEL_ID,
      text: summary,
      parse_mode: "Markdown"
    });

    // Send quiz JSON as a .json file
    const form = new FormData();
    form.append("chat_id", CHANNEL_ID);
    form.append("caption", `🧠 Quiz: *${topic}* by ${author}`);
    form.append("parse_mode", "Markdown");
    form.append("document", Buffer.from(JSON.stringify(data, null, 2)), {
      filename: `${topic.replace(/\s+/g, "_")}_quiz.json`,
      contentType: "application/json"
    });

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    res.send({ success: true });
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
