import { replaceNode } from '../utils.js';

export default function createToCBlock(main, document) {
  const toc = document.querySelector('.toc');
  toc?.querySelector(':scope .tableOfContents-mobile')?.remove();
  toc?.querySelectorAll('ol').forEach((ol) => {
    replaceNode(ol, document.createElement('ul'));
  });
  toc?.querySelectorAll('a').forEach((a) => {
    if (a.href.slice(-5) === '.html') a.href = a.href.slice(0, -5);
  });
  if (toc) {
    const cells = [
      ['toc'],
    ];
    cells.push([toc.innerHTML]);
    if (toc.innerHTML.trim()) {
      main.append(WebImporter.DOMUtils.createTable(cells, document));
    }
    toc.remove();
  }
}
