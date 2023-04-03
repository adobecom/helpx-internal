const createDownload = (document) => {
  const downloads = document.querySelectorAll('.download-section');
  downloads.forEach((download) => {
    download.firstChild.remove();
    const cells = [
      ['download'],
    ];
    download.querySelectorAll('.download-link-container').forEach((container) => {
      cells.push([
        container.querySelector('a'),
        container.querySelector('.download-description').textContent,
      ]);
    });
    console.info(cells);

    const table = WebImporter.DOMUtils.createTable(cells, document);
    download.insertAdjacentElement('beforebegin', table);
    download.remove();
  });
  console.info('poop');
};

export default createDownload;
