// NOTE: this affected by the moveTOC function in scripts.ts

const replaceNode = (oldNode, newElement) => {
  oldNode.insertAdjacentElement('beforebegin', newElement);
  newElement.replaceChildren(...oldNode.children);
  oldNode.remove();
};

const convertOlsToUls = (block) => {
  block.querySelectorAll('ol').forEach((ol) => {
    replaceNode(ol, document.createElement('ul'));
  });
};

const setRole = (element, role) => {
  element.setAttribute('role', role);
};

const isCollapsible = (li) => !!li.querySelector(':scope > ul');

const getTocHeight = () => [...document.querySelectorAll('.content-container > .section')]
  .reduce((acc, section) => acc + section.offsetHeight, 0);

const setGroup = (group, expanded) => {
  group.setAttribute('aria-expanded', expanded);
};

const initGroups = (li) => {
  setRole(li, 'group');
  li.setAttribute('aria-expanded', false);
  li.addEventListener('click', (event) => {
    event.stopPropagation();
    setGroup(li, li.ariaExpanded === 'false' ? 'true' : 'false');
  }, { passive: true });
};

const initLinksInGroup = (li) => {
  li.querySelectorAll(':scope a')
    .forEach(
      (a) => a.addEventListener('click', (e) => {
        e.stopPropagation();
      }, { passive: true }),
    );
};

const initListItems = (block) => {
  block.querySelectorAll(':scope li').forEach((li) => {
    if (isCollapsible(li)) {
      initGroups(li);
      initLinksInGroup(li);
    } else setRole(li, 'treeitem');
  });
};

export default (block) => {
  convertOlsToUls(block);
  setRole(block, 'tree');
  window.addEventListener('main-elements-loaded', () => {
    block.style.height = `${getTocHeight()}px`;
  }, { passive: true, once: true });

  initListItems(block);
};
