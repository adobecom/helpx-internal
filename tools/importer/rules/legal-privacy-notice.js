const importLegalPrivacy = (document) => {
  // even though we use querySelectorAll, there should be no more than one per page
  const notices = document.querySelectorAll('div[daa-lh="HelpX in-article navigation|Legal & Privacy footer"]');
  notices.forEach((notice) => {
    const cells = [['legal-privacy-notice']];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    notice.insertAdjacentElement('beforebegin', table);
    notice.remove();
  });
};

export default importLegalPrivacy;
