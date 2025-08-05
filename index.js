import cron from 'node-cron';
import { readEmails } from './gmail/listenEmail.js'; // Adjust path as per your file
import express from 'express'
import { config } from 'dotenv'

const app = express()
config()

app.get('/', (req, res) => {
    // Run every 1 minutes
    cron.schedule('*/1 * * * *', async () => {
        console.log('⏰ Checking emails...');
        try {
            await readEmails();
        } catch (err) {
            console.error('❌ Error in scheduled job:', err);
        }
    });
    res.send('Email tool is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});