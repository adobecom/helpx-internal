export default async (block) => {
  const styles = document.querySelector('link[href="/styles/styles.css"]');;
  styles?.remove();
  const { default: init } = await import('https://milo.adobe.com/libs/blocks/library-config/library-config.js');
  init(block);
}

