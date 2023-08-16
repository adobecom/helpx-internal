export default async (block) => {
  const { default: init } = await import('https://milo.adobe.com/libs/blocks/library-metadata/library-metadata.js');
  init(block);
}

