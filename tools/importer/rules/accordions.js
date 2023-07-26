export default function createAccordionBlocks(main, document) {
  const accordions = document.querySelectorAll('.accordion');

  // fast return
  if (!accordions) {
    return;
  }
  // we need to use reduceRight here to preserve nested accordions
  // even though we're not strictly speaking meant to do that
  [...accordions].reduceRight((_x, accordion) => {
    const items = accordion.querySelectorAll('.spectrum-Accordion-item');
    const cells = [
      ['Accordion (seo)'],
    ];

    items?.forEach((item) => {
      const text = item.querySelector('.spectrum-Accordion-itemHeader')?.textContent;
      const content = item.querySelector('.spectrum-Accordion-itemContent');

      if (content && text) {
        cells.push([text]);
        cells.push([content]);
      }
    });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    accordion.insertAdjacentElement('beforebegin', table);
    accordion.remove();
    return _x;
  }, null);
}
