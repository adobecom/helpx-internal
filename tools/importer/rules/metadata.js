
export default function createMetadataBlock(main, document) {
  // list of <meta name="..." content="..." /> tags to parse
  const metaTagNames = [
    'title',
    'description',
    'creationDate',
    'lastModifiedDate',
  ];

  const meta = {};

  metaTagNames.forEach((name) => {
    const metaEl = document.querySelector(`meta[name="${name}"]`);
    if (metaEl) {
      const content = metaEl.getAttribute('content');
      if (content) {
        meta[name] = content;
      }
    }
  });

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);
}
