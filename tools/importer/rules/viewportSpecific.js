const handleViewportSpecific = (document) => {
  const viewPortSpecificContainers = document.querySelectorAll('.viewportSpecificContainer');
  viewPortSpecificContainers.forEach((container) => {
    const viewports = ['hidden-desktop', 'hidden-tablet', 'hidden-mobile']
      .filter((viewport) => !!container.querySelector(`.${viewport}`));

    if (viewports.length) {
      if (!container.querySelector('tr')) { // if it's not already a block
        const cells = [
          [`generic (${viewports.join(', ')})`],
          [container.textContent],
        ];
        const table = WebImporter.DOMUtils.createTable(cells, document);
        container.insertAdjacentElement('beforebegin', table);
        container.remove();
      }
    }
  });
};

export default handleViewportSpecific;
