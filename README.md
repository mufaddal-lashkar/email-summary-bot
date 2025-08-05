# Email Filter & Summarization Service

An intelligent email processing service that automatically filters college-related emails, summarizes them using AI, and delivers concise updates to your Telegram.

## 🚀 Features

- **Smart Email Filtering**: Automatically identifies college-related emails based on sender addresses and keywords
- **AI-Powered Summarization**: Uses Google Gemini to generate concise summaries of filtered emails
- **Telegram Integration**: Delivers summaries directly to your Telegram chat
- **Automated Processing**: Runs on a scheduled basis using cron jobs
- **Keyword Detection**: Configurable keyword matching for enhanced filtering accuracy

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **AI Model**: Google Gemini API
- **Messaging**: Telegram Bot API
- **Scheduling**: node-cron
- **Email Access**: IMAP/POP3 (via nodemailer or similar)

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Gmail account with App Password enabled (if using Gmail)
- Google Gemini API key
- Telegram Bot Token
- Telegram Chat ID

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-filter-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Email Configuration
   EMAIL_HOST=imap.gmail.com
   EMAIL_PORT=993
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Gemini API
   GEMINI_API_KEY=your-gemini-api-key
   
   # Telegram Bot
   TELEGRAM_BOT_TOKEN=your-bot-token
   TELEGRAM_CHAT_ID=your-chat-id
   
   # Filtering Configuration
   COLLEGE_KEYWORDS=college,university,assignment,exam,deadline,course
   COLLEGE_DOMAINS=college.edu,university.edu
   
   # Cron Schedule (every hour by default)
   CRON_SCHEDULE=0 * * * *
   ```

## 🔧 Configuration

### Email Filtering Rules

The service filters emails based on:

1. **Sender Domain**: Emails from specified college domains
2. **Keywords**: Emails containing college-related keywords in subject or body
3. **Subject Patterns**: Configurable regex patterns for subject matching

### Cron Schedule

Default schedule runs every hour. Modify `CRON_SCHEDULE` in `.env`:
- `0 * * * *` - Every hour
- `*/30 * * * *` - Every 30 minutes
- `0 9,12,17 * * *` - At 9 AM, 12 PM, and 5 PM

## 🚀 Usage

1. **Start the service**
   ```bash
   npm start
   ```

2. **Development mode** (with auto-restart)
   ```bash
   npm run dev
   ```

3. **Manual processing** (one-time run)
   ```bash
   npm run process
   ```

## 📁 Project Structure

```
email-filter-service/
├── src/
│   ├── services/
│   │   ├── emailService.js      # Email fetching and filtering
│   │   ├── geminiService.js     # AI summarization
│   │   └── telegramService.js   # Telegram messaging
│   ├── utils/
│   │   ├── config.js           # Configuration management
│   │   └── logger.js           # Logging utility
│   ├── filters/
│   │   └── emailFilters.js     # Email filtering logic
│   └── app.js                  # Main application
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## 🔐 Security Setup

### Gmail App Password

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in your `.env` file

### Telegram Bot Setup

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token
4. Find your chat ID by messaging [@userinfobot](https://t.me/userinfobot)

### Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## 📊 Sample Output

When a college email is processed, you'll receive a Telegram message like:

```
🎓 College Email Summary

From: professor@university.edu
Subject: Assignment Deadline Extension
Time: 2024-01-15 14:30

📝 Summary:
The assignment deadline for CS101 has been extended to January 20th due to technical issues with the submission system. Students should submit their projects via email instead of the online portal.

🔗 Action Required: Submit assignment by Jan 20th via email
```

## 🛠️ Customization

### Adding Custom Filters

Edit `src/filters/emailFilters.js` to add custom filtering logic:

```javascript
const customFilters = {
  isCollegeEmail: (email) => {
    // Add your custom logic here
    return email.from.includes('college') || 
           email.subject.includes('assignment');
  }
};
```

### Modifying Summary Format

Update the Gemini prompt in `src/services/geminiService.js`:

```javascript
const prompt = `
Summarize this college email in a concise format:
- Key information
- Action items
- Deadlines
- Important links

Email: ${emailContent}
`;
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure App Password is correctly generated for Gmail
   - Check if 2FA is enabled

2. **No Emails Being Processed**
   - Verify email filtering criteria
   - Check if keywords match your college emails

3. **Telegram Messages Not Sent**
   - Confirm bot token and chat ID are correct
   - Ensure bot is not blocked

4. **Gemini API Errors**
   - Check API key validity
   - Monitor API quota limits

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
LOG_LEVEL=debug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI summarization
- Telegram Bot API for messaging
- Node.js community for excellent packages

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include logs and configuration (without sensitive data)

---

**⚠️ Important**: Never commit your `.env` file or share your API keys publicly. Add `.env` to your `.gitignore` file.
