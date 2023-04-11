const importProcedure = (document) => {
  const procedureList = document.querySelectorAll('.procedure');

  procedureList.forEach((procedure) => {
    const cells = [
      ['procedure'],
    ];
    procedure.querySelectorAll('li.step')
      .forEach((step) => cells.push([step.innerHTML]));
    const table = WebImporter.DOMUtils.createTable(cells, document);
    procedure.insertAdjacentElement('beforebegin', table);
    procedure.remove();
  });
};

export default importProcedure;
