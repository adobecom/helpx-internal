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

const wrapLiTextInSpan = (li) => {
  const text = li.firstChild;
  if (text.nodeType === 3) {
    const span = document.createElement('span');
    text.after(span);
    span.appendChild(text);
  }
};

const initGroups = (li) => {
  setRole(li, 'group');
  setGroup(li, 'false');
  wrapLiTextInSpan(li);
  li.addEventListener('click', (event) => {
    event.stopPropagation();
    setGroup(li, li.ariaExpanded === 'false' ? 'true' : 'false');
  }, { passive: true });
};

const initLinksInGroup = (li) => {
  li.querySelectorAll(':scope a')
    .forEach(
      (a) => {
        setRole(a.parentElement, 'treeitem');
        a.addEventListener('click', (e) => {
          e.stopPropagation();
        }, { passive: true });
      },
    );
};

const initListItems = (block) => {
  block.querySelectorAll(':scope li').forEach((li) => {
    li.setAttribute('tabindex', -1);
    if (isCollapsible(li)) {
      initGroups(li);
      initLinksInGroup(li);
    } else setRole(li, 'treeitem');
  });
};

const findCurrentNode = () => [...document.querySelectorAll('a')].find((a) => a.href === window.location.href);

const openCurrentNode = () => {
  const currentNode = findCurrentNode();
  currentNode.parentElement.setAttribute('aria-selected', true);
  currentNode.parentElement.setAttribute('tabindex', 0);
  const openAllParents = (node) => {
    const parent = node?.parentElement?.closest('li[role="group"]');
    if (!(node && parent)) return;
    setGroup(parent, 'true');
    openAllParents(parent);
  };
  openAllParents(currentNode);
  currentNode?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });
};

export default (block) => {
  convertOlsToUls(block);
  setRole(block, 'tree');
  window.addEventListener('main-elements-loaded', () => {
    block.style.height = `${getTocHeight()}px`;
    openCurrentNode();
  }, { passive: true, once: true });

  initListItems(block);
};
