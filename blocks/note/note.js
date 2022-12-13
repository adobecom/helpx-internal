
import { readBlockConfig } from '../../scripts/scripts.js';
export default function decorate(block) {
  const cfg = readBlockConfig(block);
  const $text = block.querySelector('div:first-of-type');
  if ($text) {
    $text.classList.add('content');

    if (cfg.type) {
      block.classList.add(cfg.type);
    }
    block.textContent = '';
    /*
      build container elements
    */
  
    block.append($text);

    const icon = document.createElement('div');
    icon.classList.add('icon');
    block.append(icon);
  }
}
