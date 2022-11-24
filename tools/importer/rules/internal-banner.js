
export default function createInternalBannerBlock(main, document) {
  // find the internal banner
  const el = document.querySelector('.internalBanner');

  const cells = [
    ['internal-banner'],
  ];

  const dateEl = el.querySelector('.applies-to-container');
  if (dateEl) {
    const date = dateEl.textContent.replace(/\s+/gm, ' ').trim();
    cells.push(['text', date]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);

  el.insertAdjacentElement('beforebegin', document.createElement('hr'));
  el.insertAdjacentElement('beforebegin', table);
  el.insertAdjacentElement('beforebegin', document.createElement('hr'));

  el.remove();
};
