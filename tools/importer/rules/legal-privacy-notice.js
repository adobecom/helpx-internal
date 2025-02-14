const importLegalPrivacy = (document) => {
  // even though we use querySelectorAll, there should be no more than one per page
  const notice = document.querySelector('.legalNotices');
  const a = document.createElement('a');
  a.href = 'https://main--helpx-internal--adobecom.aem.page/fragments/legal-privacy-notice';
  a.textContent = 'https://main--helpx-internal--adobecom.aem.page/fragments/legal-privacy-notice';
  notice?.insertAdjacentElement('beforebegin', a);
  notice?.remove();
};

export default importLegalPrivacy;
