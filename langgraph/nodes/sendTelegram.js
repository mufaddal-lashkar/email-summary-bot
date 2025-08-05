import { config } from 'dotenv'
import axios from 'axios';

export async function sendToTelegram(message = 'No summary', from = 'Unknown', subject = 'No subject') {
  config()
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await axios.post(url, {
    chat_id: chatId,
    text: `
📬 *New Email Notification*

*Subject:* ${subject}
*From:* ${from}

📝 *Summary:*
${message}
  `,
  });
}