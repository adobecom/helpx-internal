export default (document) => {
  document.querySelectorAll('.internal-confidential').forEach(
    (confidential) => {
      if (confidential?.textContent?.includes('On this page')) {
        confidential.remove();
        return;
      }
      const cells = [
        ['generic (internal-confidential)'],
      ];
      cells.push([confidential.innerHTML]);
      const table = WebImporter.DOMUtils.createTable(cells, document);
      confidential.insertAdjacentElement('beforebegin', table);
      confidential.remove();
    },
  );
};
