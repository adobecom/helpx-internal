
import { addRow } from "../utils.js";

export default function createAccordionBlocks(main, document) {
  const accordions = document.querySelectorAll('.accordion');

  // fast return
  if (!accordions) {
    return;
  }

  accordions.forEach((accordion) => {
    const items = accordion.querySelectorAll('.spectrum-Accordion-item');
    const accBlockTable = document.createElement('table');

    addRow(accBlockTable, document.createTextNode('Accordion (seo)'));

    // // Insert the accordion block header row
    // const accBlHdRow = accBlockTable.insertRow(-1);
    // const accBlHdRowCell = accBlHdRow.insertCell(0);
    // accBlHdRowCell.appendChild();
    
    if (items) {
      items.forEach((item) => {
        const text = document.createTextNode(item.querySelector('.spectrum-Accordion-itemHeader').textContent);
        const content = item.querySelector('.spectrum-Accordion-itemContent');

        // remove br as they wrongly add a "/" character in the output
        WebImporter.DOMUtils.remove(content, [ 'br' ]);

        addRow(accBlockTable, text);
        // // Insert a row at the end of the table
        // const newRow = accBlockTable.insertRow(-1);
        // // Insert a cell in the row at index 0
        // const newCell = newRow.insertCell(0);
        // // Append a text node to the cell
        // newCell.appendChild(text);

        addRow(accBlockTable, content);
        // // Insert a row at the end of the table
        // const newRow2 = accBlockTable.insertRow(-1);
        // // Insert a cell in the row at index 0
        // const newCell2 = newRow2.insertCell(0);
        // // Append a text node to the cell
        // newCell2.appendChild(content);
      });

      accordion.insertAdjacentElement('beforebegin', accBlockTable);

      accordion.remove();
    }
  });
}
