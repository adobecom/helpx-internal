
export default function createBeforeAfterSliders(main, document) {
  const sliders = main.querySelectorAll('.before-and-after');

  sliders.forEach((slider) => {
    const cells = [
      ['before-after-slider'],
    ];

    slider.querySelectorAll('img').forEach((img) => {
      cells.push([img]);
    });

    // const dateEl = el.querySelector('.applies-to-container');
    // if (dateEl) {
    //   const date = dateEl.textContent.replace(/\s+/gm, ' ').trim();
    //   cells.push(['text', date]);
    // }

    const table = WebImporter.DOMUtils.createTable(cells, document);

    // el.insertAdjacentElement('beforebegin', document.createElement('hr'));
    slider.insertAdjacentElement('beforebegin', table);
    // el.insertAdjacentElement('beforebegin', document.createElement('hr'));

    slider.remove();
  });
}
