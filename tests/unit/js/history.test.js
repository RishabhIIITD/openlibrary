import { initHistory } from '../../../openlibrary/plugins/openlibrary/js/history';

describe('initHistory', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('does not throw when element has no dataset or data-i18n (e.g. footer history box)', () => {
        const div = document.createElement('div');
        div.id = 'pageHistory';
        document.body.appendChild(div);

        expect(() => initHistory(div)).not.toThrow();
    });

    test('does not throw when data-i18n contains malformed JSON', () => {
        const table = document.createElement('table');
        table.id = 'pageHistory';
        table.dataset.i18n = 'invalid JSON {';
        document.body.appendChild(table);

        expect(() => initHistory(table)).not.toThrow();
    });

    test('returns early without error when comparison bar is missing', () => {
        const table = document.createElement('table');
        table.id = 'pageHistory';
        table.dataset.i18n = JSON.stringify({
            compare_button: 'Compare',
            clear_selection: 'Clear',
        });
        document.body.appendChild(table);

        expect(() => initHistory(table)).not.toThrow();
    });

    test('initializes successfully when data-i18n and comparison bar are present', () => {
        document.body.innerHTML = `
            <table id="pageHistory" data-i18n='{"compare_button":"Compare revisions {first} and {second}","clear_selection":"Clear selection"}'>
                <tbody>
                    <tr data-revision="1">
                        <td><input type="checkbox" data-revision-checkbox="1"></td>
                    </tr>
                </tbody>
            </table>
            <div id="pageHistoryCompare">
                <a data-compare-link href="#">Compare</a>
                <button data-compare-clear>Clear</button>
            </div>
        `;
        const table = document.querySelector('table#pageHistory');
        expect(() => initHistory(table)).not.toThrow();
    });
});

describe('pageHistory selector logic', () => {
    test('matches table#pageHistory[data-i18n] but ignores footer div#pageHistory', () => {
        document.body.innerHTML = `
            <div id="pageHistory" class="footer-history"></div>
            <table id="pageHistory" data-i18n='{"compare_button":"Compare"}'></table>
        `;
        const footerElem = document.querySelector('div#pageHistory');
        const targetTable = document.querySelector('table#pageHistory[data-i18n]');

        expect(footerElem.matches('table#pageHistory[data-i18n]')).toBe(false);
        expect(targetTable.matches('table#pageHistory[data-i18n]')).toBe(true);
    });
});
