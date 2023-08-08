// This file needs to be refactored, but since its only purpose is
// to import helpx-internal, I deem it not worth doing so long as it works.
// If you're trying to reuse this for some other import. make sure you refactor it correctly.
export default function transformNotes(main, document) {
  const helpxNotes = document.querySelectorAll('.helpx-note:not(.helpx-alert), .helpx-caution:not(.helpx-alert), .helpx-tip:not(.helpx-alert)');
  helpxNotes.forEach((el) => { handleHelpxNote(el, document); });

  const alertContainers = document.querySelectorAll('.helpx-alert');
  alertContainers.forEach((el) => { handleAlertContainer(el, document); });

  const helpNotes = document.querySelectorAll('.help-note:not(caution-note), .caution-note, .alert-container');
  helpNotes.forEach((el) => {
    let style = 'note'
    if (el.classList.contains('caution-note')) style = 'caution';

    if (el.classList.contains('alert-container')) style = 'alert';

    const title = el.querySelector(':scope .help-note-title');
    if (title) title.parentElement.remove();

    const cells = [
      [`Note (${style})`],
      [el.innerHTML]
    ];

    const table = WebImporter.DOMUtils.createTable(cells, document);

    el.insertAdjacentElement('beforebegin', table);
    el.remove();
  })
}

function handleHelpxNote(el, document) {
  const note = {};

  let style = 'note';
  if (el.classList.contains('helpx-caution')) {
    style = 'caution';
  } else if (el.classList.contains('helpx-tip')) style = 'tip';

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
    [`Note (${style})`],
    [note.text],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  el.insertAdjacentElement('beforebegin', table);
}

function handleAlertContainer(el, document) {
  const note = {};

  // find the text
  const text = el.querySelector('.cmp-text');
  if (text) {
    note.text = text.innerHTML.replace(/[\n\t]/gm, '');
  }

  const cells = [
    ['Note (alert)'],
    [note.text],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  el.insertAdjacentElement('beforebegin', table);
}
