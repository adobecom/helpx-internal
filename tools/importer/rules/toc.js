import { replaceNode } from '../utils.js';

export default function createToCBlock(main, document) {
  const toc = document.querySelector('.toc');
  toc.querySelectorAll('ol').forEach((ol) => {
    replaceNode(ol, document.createElement('ul'));
  });
  toc.querySelectorAll('a').forEach((a) => {
    if (a.pathname.slice(-5) === '.html') a.href = a.pathname.slice(0, -5);
    else a.href = a.pathname;
  });
  const cells = [
    ['toc'],
  ];
  cells.push([toc.innerHTML]);
  main.append(WebImporter.DOMUtils.createTable(cells, document));
  toc.remove();
}
