
import { readBlockConfig } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cfg = readBlockConfig(block);

  // remove metadata divs and keep the video embed
  const listItems = block.querySelectorAll(':scope > div');
  listItems.forEach((item, i) => {
    if (i > 0) {
      item.remove();
    }
  });

  if (cfg['video-title']) {
    const title = document.createElement('h3');
    title.textContent = cfg['video-title'];
    block.prepend(title);
  }

  if (cfg['video-description']) {
    const el = document.createElement('p');
    el.classList.add('video-description');
    el.textContent = cfg['video-description'];
    block.append(el);
  }

  if (cfg['video-author']) {
    const el = document.createElement('p');
    el.classList.add('video-author');
    el.textContent = cfg['video-author'];
    block.append(el);
  }
}
