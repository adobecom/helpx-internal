
export default function createTitleBlock(main, document) {
  /*
    search
  */

  // TODO - render proper search section/block
  var sEl = document.querySelector('#search-container');
  if (sEl) sEl.remove();

  sEl = document.querySelector('.back-to-search');
  if (sEl) sEl.remove();

  /*
    title
  */

  let title = '';

  const el = document.querySelector('.titleBar h1');
  if (el) {
    title = el.textContent;
  }

  const div = document.createElement('h1');
  div.innerHTML = title;
    
  const cells = [
    ['Section Metadata'],
    ['style', 'dark, xs spacing, page-title'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  document.body.insertAdjacentElement('afterbegin', document.createElement('hr'));
  document.body.insertAdjacentElement('afterbegin', div);
  document.body.insertAdjacentElement('afterbegin', table);

  el.remove();
}
