export default function createColumnsFromDexterFlexContainers(main, document) {

  const cItems = main.querySelectorAll('[role~="tabpanel"] > div > div');

  // init
  let cells = [];
  let firstRowColNumber = -1;
 
  for (let i = 0; i < cItems.length; i += 1) {
    const contentItem = cItems[i];

    if (
      !contentItem.classList.contains('flex')
      || !contentItem.classList.contains('aem-GridColumn')
    ) {
      if (cells.length > 0) {
        // insert created table at original position
        const table = WebImporter.DOMUtils.createTable(cells, document);
        contentItem.insertAdjacentElement('beforebegin', table);

        // reset
        cells = [];
        firstRowColNumber = -1;
      }

      continue;
    }

    if (cells.length === 0) {
      cells.push(['Columns']);
    }

    const colEls = contentItem.querySelectorAll('.position');

    let columns = [];
    colEls.forEach((colEl) => {
      columns.push(colEl);
    });
    cells.push(columns);

    if (firstRowColNumber === -1) {
      firstRowColNumber = colEls.length;
    } else {
      for (let j = colEls.length - 1; j < firstRowColNumber-1; j+=1) {
        columns.push('');
      }
    }
  }

}
