import cron from 'node-cron';
import { readEmails } from './gmail/listenEmail.js'; // Adjust path as per your file

// Run every 5 minutes
cron.schedule('*/1 * * * *', async () => {
    console.log('⏰ Checking emails...');
    try {
        await readEmails();
    } catch (err) {
        console.error('❌ Error in scheduled job:', err);
    }
});

console.log('🚀 Email watcher started. Running every 1 minutes...');
