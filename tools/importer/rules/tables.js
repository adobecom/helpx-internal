
import { addRow } from "../utils.js";

export default function createTableBlocks(main, document) {
  const tables = document.querySelectorAll('table');

  tables.forEach((tableEl) => {
    /*
      exclusions
    */

    // table inside an accordion, the import helper (in this file)
    // will already put the table in a table cell
    if (tableEl.closest('.spectrum-Accordion-item')) {
      return;
    }

    /*
      table
    */

    const clone = tableEl.cloneNode(true);

    const tableRef = document.createElement('table');
    addRow(tableRef, clone);
  
    tableEl.insertAdjacentElement('beforebegin', tableRef);

    tableEl.remove();  
  });
}
