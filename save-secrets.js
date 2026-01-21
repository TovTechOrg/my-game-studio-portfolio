const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const secrets = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_DATABASE_URL',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function run() {
    console.log('\x1b[33m%s\x1b[0m', '--- Firebase to GitHub Secret Vault (Node.js) ---');
    console.log('This script will save your keys to your GitHub repo secrets using the GitHub CLI (gh).\n');

    for (const secret of secrets) {
        const value = await askQuestion(`Enter your ${secret}: `);
        if (value) {
            console.log(`\x1b[36mSaving ${secret} to GitHub...\x1b[0m`);
            try {
                // Use echo to pipe the value to gh secret set to avoid terminal history logging
                execSync(`echo ${value} | gh secret set ${secret}`);
            } catch (error) {
                console.error(`\x1b[31mError saving ${secret}: ${error.message}\x1b[0m`);
            }
        }
    }

    console.log('\n\x1b[32m%s\x1b[0m', 'Done! Your secrets are safe in the vault.');
    console.log('You can check them at: gh secret list');
    rl.close();
}

run();
