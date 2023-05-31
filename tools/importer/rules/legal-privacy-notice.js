const importLegalPrivacy = (document) => {
  // even though we use querySelectorAll, there should be no more than one per page
  const notice = document.querySelector('div[daa-lh="HelpX in-article navigation|Legal & Privacy footer"]');
  const a = document.createElement('a');
  a.href = 'https://main--helpx-internal--adobecom.hlx.page/content/help/en/fragments/legal-privacy-notice';
  a.textContent = 'https://main--helpx-internal--adobecom.hlx.page/content/help/en/fragments/legal-privacy-notice';
  notice.insertAdjacentElement('beforebegin', a);
  notice.remove();
};

export default importLegalPrivacy;
