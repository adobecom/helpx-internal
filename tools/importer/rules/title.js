
export default function createTitleBlock(main, document) {
  /*
    search
  */

  // TODO - render proper search section/block
  document.querySelector('#search-container').remove();
  document.querySelector('.back-to-search').remove();

  /*
    title
  */

  let title = '';

  const el = document.querySelector('.titleBar h1');
  if (el) {
    title = el.textContent;
  }

  const div = document.createElement('h2');
  div.innerHTML = title;
  el.insertAdjacentElement('beforebegin', div);
    
  const cells = [
    ['Section Metadata'],
    ['style', 'dark, xs spacing'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  el.insertAdjacentElement('beforebegin', table);

  el.insertAdjacentElement('beforebegin', document.createElement('hr'));

  el.remove();
}
