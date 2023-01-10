
export default function transformNotes(main, document) {
  const helpxNotes = document.querySelectorAll('.helpx-note, .helpx-caution');
  helpxNotes.forEach((el) => {handleHelpxNote(el, document);});

  const alertContainers = document.querySelectorAll('.alert-container');
  alertContainers.forEach((el) => {handleAlertContainer(el, document);});
}



function handleHelpxNote(el, document) {
  const note = {};

  let style = 'note';
  if (el.classList.contains('helpx-caution')) {
    style = 'caution';
  }

  // find the title text
  const title = el.querySelector('.note-title');
  if (title) {
    note.title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // find the text
  const text = el.querySelector('.cmp-text');
  if (text) {
    note.text = text.innerHTML.replace(/[\n\t]/gm, '');
  }
  
  const cells = [
    ['Note'],
    [note.text],
    ['type', style],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  el.insertAdjacentElement('beforebegin', table);
}



function handleAlertContainer(el, document) {
  console.log("handleAlertContainer", el);

  const note = {};

  // find the text
  const text = el.querySelector('.cmp-text');
  if (text) {
    note.text = text.innerHTML.replace(/[\n\t]/gm, '');
  }
  
  const cells = [
    ['Note'],
    [note.text],
    ['type', `alert`],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  el.insertAdjacentElement('beforebegin', table);
}
