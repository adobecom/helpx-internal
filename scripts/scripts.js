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
export const CONFIG = {
  // codeRoot: '',
  locale: {
    contentRoot: `/${window?.location?.pathname?.split('/')?.[1]}`,
    prefix: [],
  },
  // imsClientId: 'college',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
    cn: { ietf: 'zh-CN', tk: 'qxw8hzm' },
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

// Prevent redirection to helpx url when pressing enter in search
(function shenanigans() {
  EventTarget.prototype.addEventListener = new Proxy(EventTarget.prototype.addEventListener, {
    apply: (targetFn, targetElement, argumentsList) => {
      const [event, fn] = argumentsList;
      const doNothing = () => { };
      const shouldDoNothing = targetElement?.classList?.[0] === 'gnav-search-input' && event === 'keydown';
      const args = [event, shouldDoNothing ? doNothing : fn];
      Reflect.apply(targetFn, targetElement, args);
    },
  });
}());

const { loadArea, setConfig } = await import(`${miloLibs}/utils/utils.js`);

(async function loadPage() {
  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  decorateIcons();
}());

export const setTop = (block, extra = 0) => {
  const title = document.querySelector('.page-title');
  block.style.top = `${(title?.offsetHeight ?? 0) + getHeaderMarginTop() + extra}px`;
};

export const getHeaderMarginTop = () => {
  const header = document.querySelector('header .gnav-wrapper');
  if (header) {
    return parseFloat(window.getComputedStyle(header)?.marginTop ?? 0);
  }
  return 0;
};

/* Replace icons with inline SVG and prefix with codeBasePath.
  /**
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
