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

import { setLibs } from './utils.js';

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

const { loadArea, loadDelayed, setConfig } = await import(`${miloLibs}/utils/utils.js`);

(async function loadPage() {
  setConfig({ ...CONFIG, miloLibs });

  await loadArea();

  buildAutoBlocks(document);

  /*
    extra features start
  */

  document.querySelectorAll('div:not([class]):not([id]):empty').forEach((empty) => empty.remove());

  /*
    extra features end
  */

  loadDelayed();
}());



/*
 * ------------------------------------------------------------
 * helpx-internal specifics
 * ------------------------------------------------------------
 */

/*
 * global blocks
 */

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildInternalBanner(main);
    fixTableHeaders(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

// internal banner
async function buildInternalBanner(block) {
  const title = block.querySelector('.page-title');
  
  if (title) {
    const banner = document.createElement('div');
    banner.classList.add('section', 'internal-banner');
    
    const div = document.createElement('h2');
    div.innerHTML = 'INTERNAL';
    div.classList.add("banner");
    banner.append(div);
    title.insertAdjacentElement('afterend', banner);
    
    const text = document.createElement('div');
    text.classList.add("content", "last-updated");
    text.innerHTML = '&nbsp;';
    banner.append(text);
    
    const index = await fetchIndex('query-index');
    const found = index.data.find((entry) => entry.path.indexOf(window.location.pathname) > -1);
    if (found) {
      var dateFormat = new Date(parseInt(found.lastModified + '000', 10));
      text.innerHTML = `Last updated on ${getMonthShortName((dateFormat.getMonth()))} ${dateFormat.getDate()}, ${dateFormat.getFullYear()}`; 
    }
  }
}

// tables
function fixTableHeaders(main) {
  var tables = main.querySelectorAll('table');
  tables.forEach((t) => {
    // remove empty lines
    var lines = t.querySelectorAll('tbody tr');
    lines.forEach((l) => {
      const content = l.innerHTML.replaceAll('<td></td>', '').trim();
      if (content === '') {
          l.remove();
      }
    });

    // fix header rowspan
    const headerFirstRow = t.querySelector('thead tr:first-of-type');
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

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
 export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
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
  date.setMonth(monthNo - 1);
  return date.toLocaleString('en-US', { month: 'short' });
}
