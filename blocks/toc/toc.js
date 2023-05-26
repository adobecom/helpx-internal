const setRole = (element, role) => {
  element.setAttribute('role', role);
};

const isCollapsible = (li) => !!li.querySelector(':scope > ul');

const getTocHeight = () => [...document.querySelectorAll('main div[class="section"]')]
  .reduce((acc, section) => acc + section.offsetHeight, 0);

const setGroup = (group, expanded) => {
  group.setAttribute('aria-expanded', expanded);
};

const toggleGroup = (group) => {
  setGroup(group, group.ariaExpanded === 'false' ? 'true' : 'false');
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
    toggleGroup(li);
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
        // to overcome a limitation in the import script
        a.href = a.pathname;
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
  currentNode?.parentElement.setAttribute('aria-selected', true);
  currentNode?.parentElement.setAttribute('tabindex', 0);
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

const preventScrollBelowContent = (block) => {
  const content = document.querySelector('main');
  const bottom = window.scrollY + window.innerHeight
    - content?.getBoundingClientRect().bottom - window.pageYOffset;
  block.style.top = bottom > 0 ? `${164 - bottom}px` : '164px'; // 100px + height of header = 64px
};

const createMobileTOC = (block) => {
  const tocButton = document.createElement('span');
  tocButton.classList.add('toc-mobile-drawer');
  tocButton.innerText = 'User Guide';

  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  const tocModal = document.createElement('div');
  tocModal.classList.add('toc-modal');
  modalContainer.appendChild(tocModal);
  const closeModal = () => {
    modalContainer.classList.remove('show');
    document.body.insertAdjacentElement('afterbegin', block);
  };
  const header = document.createElement('div');
  header.classList.add('toc-mobile-header');
  const home = document.createElement('div');
  const closeButton = document.createElement('button');
  const cross = document.createElement('div');
  home.classList.add('home');
  home.innerText = ' ';
  closeButton.classList.add('close');
  cross.classList.add('cross');
  closeButton.appendChild(cross);
  closeButton.addEventListener('click', closeModal);
  header.replaceChildren(home, closeButton);
  tocModal.appendChild(header);

  tocButton.addEventListener('click', () => {
    modalContainer.classList.add('show');
    tocModal.appendChild(block);
  });

  window.addEventListener('click', (event) => {
    if (event.target === modalContainer) closeModal();
  });

  window.addEventListener('resize', () => {
    // WARNING: if you change the media query breakpoints you MUST change
    // the below if statement.
    const mql = window.matchMedia('(max-width: 63.9375rem)');
    if (mql.matches) {
      tocModal.appendChild(block);
    } else document.body.insertAdjacentElement('afterbegin', block);
  });

  document.querySelector('.page-title')?.insertAdjacentElement('afterbegin', tocButton);
  document.body.insertAdjacentElement('afterbegin', modalContainer);
};

const handleKeyDown = (event) => {
  event.preventDefault();
  const current = document.activeElement.closest('li[tabindex]');
  if (current) {
    switch (event.key) {
      case 'ArrowDown':
        if (current.ariaExpanded === 'true') {
          current.querySelector(':scope li').focus();
        } else if (current.nextElementSibling) current.nextElementSibling?.focus();
        else current.parentElement.parentElement.nextElementSibling.focus();
        break;
      case 'ArrowUp':
        if (current.previousElementSibling) current.previousElementSibling?.focus();
        else current.parentElement?.parentElement.focus(); // always an li inside a ul
        break;
      case 'Enter':
        if (current.role === 'group') toggleGroup(current);
        else if (current.role === 'treeitem') {
          current.querySelector(':scope > a')?.click();
        }
        break;
      default:
        break;
    }
  }
};

// NOTE: This block is slightly different from others;
// A couple of things can only be done once the page is
// fully loaded. This means there is some coupling between
// this block and scripts.js. Specifically, the coupling is in
// the event listener for the 'main-elements-loaded' event.
export default (block) => {
  createMobileTOC(block);
  setRole(block, 'tree');

  window.addEventListener('main-elements-loaded', () => {
    block.style.height = `${getTocHeight()}px`;
    openCurrentNode();
  }, { passive: true, once: true });
  window.addEventListener('scroll', () => preventScrollBelowContent(block));
  window.addEventListener('keydown', handleKeyDown);

  initListItems(block);

  document.body.insertAdjacentElement('afterbegin', block);
};
