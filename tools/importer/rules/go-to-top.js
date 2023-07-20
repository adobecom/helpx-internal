export default (document) => {
  document.querySelectorAll('a[href="#"][target="_top"]').forEach(gtt => {
    if(gtt.textContent.toLowerCase() !== 'go to top') return;
    const cells = [['go-to-top']];
    cells.push(['Go to top']);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    gtt.insertAdjacentElement('beforebegin', table);
    gtt.remove();
  });
}
