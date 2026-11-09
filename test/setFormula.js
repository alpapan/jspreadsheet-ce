const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const jspreadsheet = require('../dist/index.js');

describe('setFormula', () => {
    afterEach(() => {
        // The other suites run with @jspreadsheet/formula registered (mocha.config.js).
        jspreadsheet.setFormula(require('@jspreadsheet/formula'));
    });

    it('calls the registered engine with the formula text, the referenced values, the cell coordinates and the worksheet', () => {
        const calls = [];
        jspreadsheet.setFormula(function (expression, variables, x, y, worksheet) {
            calls.push({ expression, variables, x, y, hasData: Array.isArray(worksheet.options.data) });
            return 42;
        });

        const test = jspreadsheet(root, {
            worksheets: [{ data: [['5', '=A1+1']] }],
        });

        expect(test[0].getValue('B1', true)).to.equal('42');
        expect(calls[calls.length - 1]).to.deep.equal({ expression: 'A1+1', variables: { A1: 5 }, x: 1, y: 0, hasData: true });
    });
});

describe('the built library', () => {
    it('neither evaluates strings nor loads @jspreadsheet/formula', () => {
        const built = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.js'), 'utf8');
        expect(built).not.to.match(/\b(eval|Function)\(/);
        expect(built).not.to.include('@jspreadsheet/formula');
    });
});
