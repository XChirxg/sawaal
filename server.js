const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "7679570224:AAHCRFPDMHBsDQ9VPOJDl4e6iea06qKTCBU";
const CHANNEL_ID = "@sawaal_app"; // Your channel username

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.post("/upload", async (req, res) => {
  const quizJson = req.body;

  const topic = quizJson.topic || "Untitled";
  const author = quizJson.author || "Anonymous";

  const caption = `🧠 New Community Quiz!\n📌 Topic: *${topic}*\n👤 Author: *${author}*`;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHANNEL_ID,
      text: caption + "\n\n```json\n" + JSON.stringify(quizJson, null, 2) + "\n```",
      parse_mode: "Markdown"
    });

    res.send({ success: true });
  } catch (err) {
    console.error("Telegram error:", err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
