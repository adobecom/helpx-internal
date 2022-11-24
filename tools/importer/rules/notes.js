
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
    ['Section Metadata'],
    ['style', `note, ${style}`],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // append the block to the main element
  el.insertAdjacentElement('beforebegin', document.createElement('hr'));
  const d = document.createElement('div');
  d.innerHTML = note.text;

  el.insertAdjacentElement('beforebegin', d);
  el.insertAdjacentElement('beforebegin', table);
  el.insertAdjacentElement('beforebegin', document.createElement('hr'));
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
    ['Section Metadata'],
    ['style', `note, alert`],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // append the block to the main element
  el.insertAdjacentElement('beforebegin', document.createElement('hr'));
  const d = document.createElement('div');
  d.innerHTML = note.text;

  el.insertAdjacentElement('beforebegin', d);
  el.insertAdjacentElement('beforebegin', table);
  el.insertAdjacentElement('beforebegin', document.createElement('hr'));
}
