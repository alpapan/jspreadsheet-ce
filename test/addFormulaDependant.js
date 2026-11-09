const { expect } = require('chai');

const jspreadsheet = require('../dist/index.js');

describe('addFormulaDependant', () => {
    afterEach(() => {
        // The other suites run with @jspreadsheet/formula registered (mocha.config.js).
        jspreadsheet.setFormula(require('@jspreadsheet/formula'));
    });

    it('re-evaluates a formula cell when a cell recorded as read by it changes', () => {
        // The engine reads B2 straight from the data, a cell the formula text does not name.
        jspreadsheet.setFormula(function (expression, variables, x, y, worksheet) {
            return worksheet.options.data[1][1];
        });

        const test = jspreadsheet(root, {
            worksheets: [
                {
                    data: [
                        ['1', '', '=A1'],
                        ['', '5', ''],
                    ],
                },
            ],
        });
        expect(test[0].getValue('C1', true)).to.equal('5');

        test[0].addFormulaDependant('B2', 'C1');
        test[0].setValue('B2', '7');

        expect(test[0].getValue('C1', true)).to.equal('7');
    });

    it('records each dependant once, and never a cell as its own dependant', () => {
        jspreadsheet.setFormula(function () {
            return 0;
        });

        const test = jspreadsheet(root, {
            worksheets: [{ data: [['1', '', '=A1']] }],
        });

        test[0].addFormulaDependant('B1', 'C1');
        test[0].addFormulaDependant('B1', 'C1');
        test[0].addFormulaDependant('C1', 'C1');

        expect(test[0].formula['B1']).to.deep.equal(['C1']);
        expect(test[0].formula['C1']).to.equal(undefined);
        expect(test[0].formula['A1']).to.deep.equal(['C1']);
    });
});
