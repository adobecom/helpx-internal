import { decorateIcons, setTop, CONFIG } from '../../scripts/scripts.js';
import { setLibs } from '../../scripts/utils.js';

(function preventCLS() {
  const hasTOCFragment = [...document.querySelectorAll('a')].find((a) => a.href.includes('fragments/toc/'));
  if (document.querySelector('.toc') || hasTOCFragment) {
    const styles = document.createElement('style');
    const newRule = `
    body > main > div.section:not(.internal-banner, .page-title) {
      padding-left: 335px;
    }
    `;
    const titleRule = `
      body > main .page-title h1 {
        margin-left: 6%;
      }
    `;
    document.head.append(styles);
    styles.sheet.insertRule(newRule);
    styles.sheet.insertRule(titleRule);
  }
}());

// Use '/libs' if your live site maps '/libs' to milo's origin.
const LIBS = 'https://milo.adobe.com/libs';

const miloLibs = setLibs(LIBS);
const { loadStyle } = await import(`${miloLibs}/utils/utils.js`);
const { replaceText } = await import(`${miloLibs}/features/placeholders.js`);

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */

const giveImgTitles = () => {
  document.querySelectorAll('img').forEach((img) => {
    img.title = img?.alt;
  });
};

const decorateFirstH2 = () => {
  document.querySelector('h2')?.classList.add('first');
};

const removeEmptyDivs = () => {
  document.querySelectorAll('div:not([class]):not([id]):empty').forEach((empty) => empty.remove());
};

const getHeaderMarginTop = () => {
  const header = document.querySelector('header .gnav-wrapper');
  if (header) {
    return parseFloat(window.getComputedStyle(header)?.marginTop ?? 0);
  }
  return 0;
};

const fixTitle = () => {
  const header = document.querySelector('header');
  const title = document.querySelector('.page-title');

  if (header && title) {
    title.style.top = `${header.offsetHeight + getHeaderMarginTop()}px`;
    window.addEventListener('resize', () => {
      title.style.top = `${header.offsetHeight + getHeaderMarginTop()}px`;
    });
    const firstSection = document.querySelector('.page-title + div.section:not(.internal-banner, .page-title');
    if (!firstSection) return;
    const setPaddingTop = () => {
      firstSection.style.paddingTop = `${title.offsetHeight + getHeaderMarginTop() + 100}px`;
    };
    setPaddingTop();
    new ResizeObserver(setPaddingTop).observe(title);
  }
};

const renderNestedBlocks = () => {
  const blockList = ['before-after-slider', 'code', 'download', 'generic', 'note', 'procedure', 'go-to-top']; // not toc
  const miloBlocks = ['accordion'];

  const replaceNode = (oldNode, newElement) => {
    oldNode.insertAdjacentElement('beforebegin', newElement);
    newElement.replaceChildren(...oldNode.childNodes);
    oldNode.remove();
  };
  const getBlockName = (table) => {
    const thead = table?.querySelector(':scope > thead');
    if (thead) {
      return thead?.textContent.trim().split(' ')[0].toLowerCase();
    }
    return table.querySelector('tr:first-of-type').textContent.trim().split(' ')[0].toLowerCase();
  };

  const convertBlock = (table) => {
    const parent = document.createElement('div');
    const thead = table.querySelector(':scope thead') || table.querySelector('tr:first-of-type');
    parent.classList.add(thead?.textContent.split('(')[0].trim().toLowerCase());
    thead.textContent
      .match(/\(([^\)]+)\)/)?.[1]
      ?.split?.(',')
      .map((cls) => parent.classList.add(cls.trim().toLowerCase()));
    thead.remove();
    replaceNode(table, parent);
    parent.replaceChildren(...parent.querySelector(':scope > tbody').children);
    parent.querySelectorAll(':scope > tr, :scope > tr > td').forEach((el) => replaceNode(el, document.createElement('div')));
    return parent;
  };

  const loadBlock = (block, t, milo = false) => {
    const basePath = milo ? LIBS : '';
    import(`${basePath}/blocks/${block}/${block}.js`).then(({ default: init }) => {
      const bl = convertBlock(t);
      init(bl);
    })
      .then(() => {
        loadStyle(`${basePath}/blocks/${block}/${block}.css`, null);
      }).catch((e) => {
        console.log(`Failed loading ${block}`, e);
      });
  };
  document.querySelectorAll('table').forEach((table) => {
    // if table > thead textContent contains something from that blockList
    const blockName = getBlockName(table);
    blockList.map((b) => {
      if (blockName === b) loadBlock(b, table);
      return null;
    });
    miloBlocks.map((b) => {
      if (blockName === b) loadBlock(b, table, true);
      return null;
    });
  });
};

function getBCPTag() {
  const loc = CONFIG.locale.contentRoot;
  switch (loc) {
    case '/jp': return 'ja-JP-u-ca-japanese';
    case '/kr': return 'ko-KR';
    case '/cn': return 'zh-Hans';
    default: return 'en-US';
  }
}

// internal banner
async function buildInternalBanner() {
  const title = document.body.querySelector('.page-title');

  if (title) {
    const banner = document.createElement('div');
    banner.classList.add('section', 'internal-banner');

    const div = document.createElement('div');
    div.innerHTML = '<span class="icon icon-info"></span>INTERNAL';
    div.classList.add('banner');
    banner.append(div);
    title.insertAdjacentElement('afterend', banner);
    decorateIcons(banner);
    const setPaddingTop = () => {
      banner.style.paddingTop = `${title.offsetHeight + getHeaderMarginTop()}px`;
    };
    banner.style.paddingTop = `${title.offsetHeight + getHeaderMarginTop()}px`;
    // needed to make sticky behaviour correct, specifically,
    // so that the internal banner is always below the sticky title
    // when scrollHeight is 0.
    new ResizeObserver(setPaddingTop).observe(title);

    const text = document.createElement('div');
    text.classList.add('content', 'last-updated');
    text.innerHTML = '&nbsp;';
    document.body
      .querySelector('main > div[class=section]')
      .insertAdjacentElement('afterbegin', text);
    text.addEventListener('click', () => text.classList.toggle('show-more'));

    // get last updated date from the http header
    let dateFormat;
    try {
      const resp = await fetch(document.location, { method: 'HEAD' });
      dateFormat = new Date(resp.headers.get('last-modified'));
    } catch (e) {
      dateFormat = new Date(0);
      console.error(e);
    }

    dateFormat = new Intl.DateTimeFormat(getBCPTag(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateFormat);
    const productNames = document.querySelector('meta[name="productnames"]')?.content.split(',');
    const primary = document.querySelector('meta[name="primaryproductname"]')?.content;
    const productList = productNames?.length ? productNames.filter((x) => x !== primary) : [];
    const aat = await replaceText('{{also-applies-to}}', CONFIG);
    const alsoAppliesTo = productList.length ? ` | ${aat} ${productList.join(', ')} ` : '';
    const lastUpdatedOn = await replaceText('{{last-updated-on}}', CONFIG);
    text.innerHTML = `${lastUpdatedOn} ${dateFormat} ${alsoAppliesTo}`;
  }
}

// tables
function fixTableHeaders() {
  const tables = document.body.querySelectorAll('table');
  tables.forEach((t) => {
    // remove empty lines
    const lines = t.querySelectorAll('tbody tr');
    lines.forEach((l) => {
      const content = l.innerHTML.replaceAll('<td></td>', '').trim();
      if (content === '') {
        l.remove();
      }
    });

    // fix header rowspan
    const headerFirstRow = t.querySelector('thead tr:first-of-type');
    if (!headerFirstRow) return;
    const nHeaderTDs = headerFirstRow.querySelectorAll('th')?.length;
    const bodyFirstRow = t.querySelector('tbody tr:first-of-type');
    const nBodyTDs = bodyFirstRow?.querySelectorAll('td')?.length;
    if (nHeaderTDs === 2 && nBodyTDs === 3) {
      const tHead = t.querySelector('thead');
      if (tHead) {
        tHead.appendChild(bodyFirstRow);
        bodyFirstRow.querySelector('td:empty')?.remove();
        tHead.querySelector('tr:first-of-type th:first-of-type')?.setAttribute('rowspan', 2);
      }
    }
  });
}

const buildOnThisPageSection = () => {
  const container = document.createElement('div');
  container.classList.add('on-this-page');
  const content = document.createElement('div');
  content.classList.add('content');
  container.append(content);
  const onThisPageTitle = document.createElement('p');
  onThisPageTitle.textContent = 'On this page';
  content.append(onThisPageTitle);
  document.querySelectorAll('h2').forEach((heading) => {
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.addEventListener('click', (e) => {
      const url = new URL(window.location.href);
      url.hash = `#${heading.id}`;
      window.history.replaceState(null, null, url);
      e.preventDefault();
      heading.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    });
    content.append(a);
  });

  const topOffset = 150;
  const preventScrollBelowContent = (block) => {
    const main = document.querySelector('main');
    const bottom = window.scrollY + window.innerHeight
      - main.getBoundingClientRect().bottom - window.pageYOffset;
    const offset = bottom > 0 ? topOffset - bottom : topOffset;
    setTop(block, offset);
  };
  setTop(container, topOffset);
  const title = document.querySelector('.page-title');
  new ResizeObserver(() => setTop(container, topOffset)).observe(title);
  window.addEventListener('scroll', () => preventScrollBelowContent(container));
  document.querySelector('main')?.append(container);
};

/*
 * utils
 */

/**
 * Sanitizes a name for use as class name.
 * @param {*} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

export async function fetchIndex(indexFile, pageSize = 500) {
  const handleIndex = async (offset) => {
    const resp = await fetch(`/${indexFile}.json?limit=${pageSize}&offset=${offset}`);
    const json = await resp.json();

    const newIndex = {
      complete: (json.limit + json.offset) === json.total,
      offset: json.offset + pageSize,
      promise: null,
      data: [...window.index[indexFile].data, ...json.data],
    };

    return newIndex;
  };

  window.index = window.index || {};
  window.index[indexFile] = window.index[indexFile] || {
    data: [],
    offset: 0,
    complete: false,
    promise: null,
  };

  // Return index if already loaded
  if (window.index[indexFile].complete) {
    return window.index[indexFile];
  }

  // Return promise if index is currently loading
  if (window.index[indexFile].promise) {
    return window.index[indexFile].promise;
  }

  window.index[indexFile].promise = handleIndex(window.index[indexFile].offset);
  const newIndex = await (window.index[indexFile].promise);
  window.index[indexFile] = newIndex;

  return newIndex;
}

function getMonthShortName(monthNo) {
  const date = new Date();
  date.setMonth(monthNo);
  return date.toLocaleString('en-US', { month: 'short' });
}

function buildAutoBlocks() {
  try {
    fixTitle();
    decorateFirstH2();
    buildInternalBanner();
    fixTableHeaders();
    buildOnThisPageSection();
    renderNestedBlocks();
    removeEmptyDivs();
    giveImgTitles();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

buildAutoBlocks();
