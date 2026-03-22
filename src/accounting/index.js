// Node.js implementation of the COBOL Account Management System
// Preserves business logic, data integrity, and menu options

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'balance.json');
const INITIAL_BALANCE = 1000.00;

function readBalance() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: INITIAL_BALANCE }));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data).balance;
}

function writeBalance(newBalance) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: newBalance }));
}

function displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let continueFlag = true;

    while (continueFlag) {
        displayMenu();
        const choice = await new Promise(res => rl.question('Enter your choice (1-4): ', res));
        switch (choice.trim()) {
            case '1': {
                const balance = readBalance();
                console.log(`Current balance: ${balance.toFixed(2)}`);
                break;
            }
            case '2': {
                const amountStr = await new Promise(res => rl.question('Enter credit amount: ', res));
                const amount = parseFloat(amountStr);
                if (isNaN(amount) || amount < 0) {
                    console.log('Invalid amount.');
                    break;
                }
                let balance = readBalance();
                balance += amount;
                writeBalance(balance);
                console.log(`Amount credited. New balance: ${balance.toFixed(2)}`);
                break;
            }
            case '3': {
                const amountStr = await new Promise(res => rl.question('Enter debit amount: ', res));
                const amount = parseFloat(amountStr);
                if (isNaN(amount) || amount < 0) {
                    console.log('Invalid amount.');
                    break;
                }
                let balance = readBalance();
                if (balance >= amount) {
                    balance -= amount;
                    writeBalance(balance);
                    console.log(`Amount debited. New balance: ${balance.toFixed(2)}`);
                } else {
                    console.log('Insufficient funds for this debit.');
                }
                break;
            }
            case '4':
                continueFlag = false;
                console.log('Exiting the program. Goodbye!');
                break;
            default:
                console.log('Invalid choice, please select 1-4.');
        }
    }
    rl.close();
}

// Export for testing
module.exports = { readBalance, writeBalance };

if (require.main === module) {
    main();
}
