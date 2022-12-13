
export default function createInternalBannerBlock(main, document) {
  // find the internal banner
  // and remove it as in milo implementation it is handled
  // as a global block with the last modified date extracted
  // from the main index
  const el = document.querySelector('.internalBanner');
  if (el) {
    el.remove();
  }
};
