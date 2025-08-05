// import { google } from 'googleapis'
// import { authenticate } from './auth.js'
// import { getSummary } from '../langgraph/nodes/summarize.js'
// import { sendToTelegram } from '../langgraph/nodes/sendTelegram.js'

// // ✅ Filter rules - customize as needed
// const filterConfig = {
//     from: ['no-reply@classroom.google.com', 'donlashkarwala@gmail.com'], // Sender filters
//     subjectIncludes: [],           // Subject keywords
//     bodyIncludes: [],        // Body keywords
// };

// // ✅ Function to check if an email matches filters
// function emailMatchesFilters({ from, subject, body }) {
//     const fromMatch = filterConfig.from.some(f => from.includes(f));
//     const subjectMatch = filterConfig.subjectIncludes.some(k => subject.toLowerCase().includes(k.toLowerCase()));
//     const bodyMatch = filterConfig.bodyIncludes.some(k => body.toLowerCase().includes(k.toLowerCase()));
//     return fromMatch || subjectMatch || bodyMatch;
// }

// // ✅ Main email reading function
// async function readEmails() {
//     const auth = await authenticate();
//     const gmail = google.gmail({ version: 'v1', auth });

//     const res = await gmail.users.messages.list({
//         userId: 'me',
//         maxResults: 20,
//         q: 'is:unread after:2025/08/03', // You can use Gmail search query here if needed
//     });

//     const messages = res.data.messages || [];
//     const filteredEmails = [];

//     for (const msg of messages) {
//         const message = await gmail.users.messages.get({
//             userId: 'me',
//             id: msg.id,
//             format: 'full',
//         });

//         const headers = message.data.payload.headers;
//         const subjectHeader = headers.find(h => h.name === 'Subject');
//         const fromHeader = headers.find(h => h.name === 'From');

//         const subject = subjectHeader?.value || '';
//         const from = fromHeader?.value || '';
//         const snippet = message.data.snippet || '';

//         const email = {
//             id: msg.id,
//             from,
//             subject,
//             body: snippet,
//         };

//         if (emailMatchesFilters(email)) {
//             filteredEmails.push(email);
//         }

//         await gmail.users.messages.modify({
//             userId: 'me',
//             id: msg.id,
//             requestBody: {
//                 removeLabelIds: ['UNREAD'],
//             },
//         });
//     }

//     if (messages.length === 0) {
//         console.log('📭 No unread emails found.');
//     }

//     console.log(`📨 Filtered ${filteredEmails.length} matching emails:\n`);
//     filteredEmails.forEach(async (email, index) => {
//         console.log(`#${index + 1}`);
//         console.log('From:', email.from);
//         console.log('Subject:', email.subject);
//         console.log('Snippet:', email.body);
//         console.log('---\n');

//         const summarizeAndSend = async (email) => {
//             const count = 0
//             try {
//                 const summary = await getSummary(email.subject, email.body)
//                 await sendToTelegram(summary, email.from, email.subject)
//             } catch (error) {
//                 if (count < 3) {
//                     summarizeAndSend()
//                 } else {
//                     break;
//                 }
//             }
//         }
//         summarizeAndSend()

//     });

// }

// readEmails().catch(console.error);

import { google } from 'googleapis';
import { authenticate } from './auth.js';
import { getSummary } from '../langgraph/nodes/summarize.js';
import { sendToTelegram } from '../langgraph/nodes/sendTelegram.js';

// ✅ Filter rules
const filterConfig = {
    from: ['no-reply@classroom.google.com', 'donlashkarwala@gmail.com'],
    subjectIncludes: [],
    bodyIncludes: [],
};

function emailMatchesFilters({ from, subject, body }) {
    const fromMatch = filterConfig.from.some(f => from.includes(f));
    const subjectMatch = filterConfig.subjectIncludes.some(k => subject.toLowerCase().includes(k.toLowerCase()));
    const bodyMatch = filterConfig.bodyIncludes.some(k => body.toLowerCase().includes(k.toLowerCase()));
    return fromMatch || subjectMatch || bodyMatch;
}

// ✅ Retry wrapper for Gemini & Telegram
async function summarizeAndSend(email, retries = 0) {
    try {
        const summary = await getSummary(email.subject, email.body);
        await sendToTelegram(summary, email.from, email.subject);
    } catch (error) {
        console.error(`❌ Error on attempt ${retries + 1}:`, error.message);
        if (retries < 3) {
            console.log('🔁 Retrying...');
            await summarizeAndSend(email, retries + 1);
        } else {
            console.log('⚠️ Failed after 3 attempts. Skipping.');
        }
    }
}

export async function readEmails() {
    const auth = await authenticate();
    const gmail = google.gmail({ version: 'v1', auth });

    // 👇 Use dynamic yesterday filter if needed
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 20,
        q: 'is:unread after:2025/08/03',
    });

    const messages = res.data.messages || [];
    const filteredEmails = [];

    for (const msg of messages) {
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'full',
        });

        const headers = message.data.payload.headers;
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');

        const subject = subjectHeader?.value || '';
        const from = fromHeader?.value || '';
        const snippet = message.data.snippet || '';

        const email = {
            id: msg.id,
            from,
            subject,
            body: snippet,
        };

        if (emailMatchesFilters(email)) {
            filteredEmails.push(email);
        }

        await gmail.users.messages.modify({
            userId: 'me',
            id: msg.id,
            requestBody: {
                removeLabelIds: ['UNREAD'],
            },
        });
    }

    if (messages.length === 0) {
        console.log('📭 No unread emails found.');
    }

    console.log(`📨 Filtered ${filteredEmails.length} matching emails:\n`);

    for (let i = 0; i < filteredEmails.length; i++) {
        const email = filteredEmails[i];
        console.log(`#${i + 1}`);
        console.log('From:', email.from);
        console.log('Subject:', email.subject);
        console.log('Snippet:', email.body);
        console.log('---\n');

        await summarizeAndSend(email);
    }
}

readEmails().catch(console.error);
