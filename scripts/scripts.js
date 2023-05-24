/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { fetchPlaceholders, setLibs } from './utils.js';

// Add project-wide styles here.
const STYLES = '/styles/styles.css';

// Use '/libs' if your live site maps '/libs' to milo's origin.
const LIBS = 'https://milo.adobe.com/libs';

// Add any config options.
const CONFIG = {
  // codeRoot: '',
  // contentRoot: '',
  // imsClientId: 'college',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
};

const ICON_ROOT = '/icons';

// Default to loading the first image as eager.
(async function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.setAttribute('loading', 'eager');
}());

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

export function initHlx() {
  window.hlx = window.hlx || {};
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';
  window.hlx.codeBasePath = '';

  const scriptEl = document.querySelector('script[src$="/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split('/scripts/scripts.js');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}
initHlx();

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(function preventCLS() {
  if (document.querySelector('.toc')) {
    const styles = document.createElement('style');
    const newRule = `
    body > main div[class="section"], body > main .content.last-updated {
      padding-left: 335px;
    }
    `;
    document.head.append(styles);
    styles.sheet.insertRule(newRule);
  }
}());

const { loadArea, loadDelayed, setConfig, loadStyle } = await import(`${miloLibs}/utils/utils.js`);

(async function loadPage() {
  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  buildAutoBlocks();
  loadDelayed();
}());

/*
 * ------------------------------------------------------------
 * helpx-internal specifics
 * ------------------------------------------------------------
 */

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    buildInternalBanner();
    fixPageLayout();
    fixTableHeaders();
    buildOnThisPageSection();

    dispatchMainEventsLoaded();

    renderNestedHelpxBlocks();
    removeEmptyDivs();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

const dispatchMainEventsLoaded = () => {
  const event = new Event('main-elements-loaded', { bubbles: false });
  window.dispatchEvent(event);
};

const removeEmptyDivs = () => {
  document.querySelectorAll('div:not([class]):not([id]):empty').forEach((empty) => empty.remove());
};

const fixPageLayout = () => {
  const header = document.querySelector('header');
  const title = document.querySelector('.page-title');

  title.style.top = `${header.offsetHeight}px`;
  window.addEventListener('resize', () => {
    title.style.top = `${header.offsetHeight}px`;
  });

  if (document.querySelector('.toc')) {
    const h1 = title.querySelector(':scope h1');
    h1.style.marginLeft = '6%';
  }
};

const renderNestedHelpxBlocks = () => {
  const blockList = ['before-after-slider', 'code', 'download', 'generic', 'note', 'procedure']; // not toc

  const replaceNode = (oldNode, newElement) => {
    oldNode.insertAdjacentElement('beforebegin', newElement);
    newElement.replaceChildren(...oldNode.childNodes);
    oldNode.remove();
  };
  const getBlockName = (table) => table
    ?.querySelector(':scope > thead')
    ?.textContent
    .trim().split(' ')[0]
    .toLowerCase();

  const convertBlock = (table) => {
    const parent = document.createElement('div');
    const thead = table.querySelector(':scope thead');
    parent.classList.add(thead?.textContent.split('(')[0].trim().toLowerCase());
    thead.textContent
      .match(/\(([^\)]+)\)/)
      ?.split?.(',')
      .map((cls) => parent.classList.add(cls.trim().toLowerCase()));
    thead.remove();
    replaceNode(table, parent);
    parent.replaceChildren(...parent.querySelector(':scope tbody').children);
    parent.querySelectorAll('tr, td').forEach((el) => replaceNode(el, document.createElement('div')));
    return parent;
  };

  const loadBlock = (block, t) => {
    import(`/blocks/${block}/${block}.js`).then(({ default: init }) => {
      const bl = convertBlock(t);
      init(bl);
    })
      .then(() => {
        loadStyle(`/blocks/${block}/${block}.css`, null);
      }).catch((e) => {
        console.log(`Failed loading ${block}`, e);
      });
  };
  document.querySelectorAll('table').forEach((table) => {
    // if table > thead textContent contains something from that blockList
    blockList.map((b) => {
      if (getBlockName(table) === b) loadBlock(b, table);
      return null;
    });
  });
};

/**
 * Replace icons with inline SVG and prefix with codeBasePath.
 * @param {Element} element
 */
export function decorateIcons(element = document) {
  element.querySelectorAll('span.icon').forEach(async (span) => {
    if (span.classList.length < 2 || !span.classList[1].startsWith('icon-')) {
      return;
    }
    const icon = span.classList[1].substring(5);
    const resp = await fetch(`${window.hlx.codeBasePath}${ICON_ROOT}/${icon}.svg`);
    if (resp.ok) {
      const iconHTML = await resp.text();
      if (iconHTML.match(/<style/i)) {
        const img = document.createElement('img');
        img.src = `data:image/svg+xml,${encodeURIComponent(iconHTML)}`;
        span.appendChild(img);
      } else {
        span.innerHTML = iconHTML;
      }
    }
  });
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
    banner.style.paddingTop = `${title.offsetHeight}px`;
    // needed to make sticky behaviour correct, specifically,
    // so that the internal banner is always below the sticky title
    // when scrollHeight is 0.
    window.addEventListener('resize', () => {
      banner.style.paddingTop = `${title.offsetHeight}px`;
    });

    const text = document.createElement('div');
    text.classList.add('content', 'last-updated');
    text.innerHTML = '&nbsp;';
    banner.append(text);

    const index = await fetchIndex('query-index');
    const found = index.data.find((entry) => entry.path.indexOf(window.location.pathname) > -1);
    if (found) {
      const placeholders = await fetchPlaceholders();
      const dateFormat = new Date(parseInt(`${found.lastModified}000`, 10));
      text.innerHTML = `${placeholders.lastUpdatedOn || 'Last updated on'} ${getMonthShortName((dateFormat.getMonth()))} ${dateFormat.getDate()}, ${dateFormat.getFullYear()}`;
    }
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
    const nBodyTDs = bodyFirstRow.querySelectorAll('td')?.length;
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
  const preventScrollBelowContent = (block) => {
    const main = document.querySelector('main');
    const bottom = window.scrollY + window.innerHeight
      - main.getBoundingClientRect().bottom - window.pageYOffset;
    block.style.top = bottom > 0 ? `${205 - bottom}px` : '205px';
  };
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
