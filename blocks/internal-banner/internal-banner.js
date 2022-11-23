import { readBlockConfig } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  
  block.querySelector('div').remove();

  const text = document.createElement('div');
  text.innerHTML = cfg.text;
  text.classList.add("last-updated");
  text.classList.add("content");
  block.closest('.section').append(text);

  const div = document.createElement('h2');
  div.innerHTML = 'INTERNAL';
  div.classList.add("banner");
  block.prepend(div);
}
