// gmail/auth.js (type: module)

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import open from 'open';
import readline from 'readline';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

export async function authenticate() {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    }

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('🔗 Authorize this app by visiting:', authUrl);
    await open(authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code = await new Promise((resolve) => {
        rl.question('🔑 Enter the code from that page: ', resolve);
    });

    rl.close();

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    return oAuth2Client;
}
