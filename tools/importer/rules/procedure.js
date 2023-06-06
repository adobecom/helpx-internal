const importProcedure = (document) => {
  const procedureList = document.querySelectorAll('ol.steps');

  [...procedureList].reduceRight((_x, procedure) => {
    const cells = [
      ['procedure'],
    ];
    procedure.querySelectorAll(':scope > li.step')
      .forEach((step) => {
        const stepContent = step.querySelector(':scope > .step');
        cells.push([stepContent]);
      });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    procedure.insertAdjacentElement('beforebegin', table);
    procedure.remove();
    return _x;
  }, null);
};

export default importProcedure;
