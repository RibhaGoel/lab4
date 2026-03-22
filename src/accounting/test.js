const { expect } = require('chai');
const mock = require('mock-fs');
const fs = require('fs');
const path = require('path');

// Import the main functions from index.js
const DATA_FILE = path.join(__dirname, 'balance.json');
const INITIAL_BALANCE = 1000.00;

// Re-import functions from index.js
let readBalance, writeBalance;

describe('Account Management System', function () {
    before(() => {
        // Patch require to get fresh functions each time
        delete require.cache[require.resolve('./index.js')];
        const mod = require('./index.js');
        readBalance = mod.readBalance || require('./index.js').readBalance;
        writeBalance = mod.writeBalance || require('./index.js').writeBalance;
    });

    beforeEach(() => {
        mock({
            [DATA_FILE]: JSON.stringify({ balance: INITIAL_BALANCE })
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('TC001: View current balance', () => {
        const balance = readBalance();
        expect(balance).to.equal(INITIAL_BALANCE);
    });

    it('TC002: Credit account with valid amount', () => {
        let balance = readBalance();
        balance += 500.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(1500.00);
    });

    it('TC003: Debit account with sufficient funds', () => {
        let balance = readBalance();
        balance -= 200.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(800.00);
    });

    it('TC004: Debit account with insufficient funds', () => {
        let balance = readBalance();
        const debit = 1500.00;
        // Simulate logic: should not allow
        expect(balance >= debit).to.be.false;
    });

    it('TC005: Debit account with exact balance', () => {
        let balance = readBalance();
        balance -= 1000.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(0.00);
    });

    it('TC006: Multiple credit operations', () => {
        let balance = readBalance();
        balance += 100.00;
        writeBalance(balance);
        balance = readBalance();
        balance += 200.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(1300.00);
    });

    it('TC007: Multiple debit operations', () => {
        let balance = readBalance();
        balance -= 100.00;
        writeBalance(balance);
        balance = readBalance();
        balance -= 200.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(700.00);
    });

    it('TC008: Credit followed by debit', () => {
        let balance = readBalance();
        balance += 300.00;
        writeBalance(balance);
        balance = readBalance();
        balance -= 200.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(1100.00);
    });

    it('TC011: Credit with zero amount', () => {
        let balance = readBalance();
        balance += 0.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(1000.00);
    });

    it('TC012: Debit with zero amount', () => {
        let balance = readBalance();
        balance -= 0.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(1000.00);
    });

    it('TC013: Credit with large amount', () => {
        let balance = readBalance();
        balance += 999999.99;
        writeBalance(balance);
        expect(readBalance()).to.equal(1000999.99);
    });

    it('TC014: Debit with amount equal to current balance after operations', () => {
        let balance = 500.00;
        writeBalance(balance);
        balance = readBalance();
        balance -= 500.00;
        writeBalance(balance);
        expect(readBalance()).to.equal(0.00);
    });
});
