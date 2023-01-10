
// FOR NOW ONLY REMOVE IT
// TODO - render proper block/section for this content
export default function createToCBlock(main, document) {
  const el = document.querySelector('.xfreference');
  if (el) {
    const parent = el.closest('.position');
    if (parent) {
      parent.remove();
    }
  }

  // const cells = [
  //   ['Table of contents'],
  //   ['Sign In Block'],
  //   ['On this page'],
  // ];
  // const table = WebImporter.DOMUtils.createTable(cells, document);
  // // append the block to the main element
  // main.append(table);
}
