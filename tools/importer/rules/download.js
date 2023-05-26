const createDownload = (document) => {
  const downloads = document.querySelectorAll('.download-section');
  downloads.forEach((download) => {
    download.firstChild.remove();
    const cells = [
      ['download'],
    ];
    download.querySelectorAll('.download-link-container').forEach((container) => {
      const a = container.querySelector(':scope a');
      a.href = `https://helpx-internal.corp.adobe.com${a.href}`;
      cells.push([
        a,
        container.querySelector('.download-description').textContent,
      ]);
    });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    download.insertAdjacentElement('beforebegin', table);
    download.remove();
  });
};

export default createDownload;
