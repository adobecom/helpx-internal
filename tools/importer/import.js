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
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadataBlock = (main, document) => {
  // list of <meta name="..." content="..." /> tags to parse
  const metaTagNames = [
    'title',
    'description',
    'creationDate',
    'lastModifiedDate',
  ];

  const meta = {};

  metaTagNames.forEach((name) => {
    const metaEl = document.querySelector(`meta[name="${name}"]`);
    if (metaEl) {
      const content = metaEl.getAttribute('content');
      if (content) {
        meta[name] = content;
      }
    }
  });

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);
};


const createAccordionBlocks = (main, document) => {
  const accordions = document.querySelectorAll('.accordion');
  // fast return
  if (!accordions) {
    return;
  }

  accordions.forEach((accordion) => {
    const items = accordion.querySelectorAll('.spectrum-Accordion-item');
    const tableRef = document.createElement('table');

    // Insert a row at the end of the table
    const newRow = tableRef.insertRow(-1);
    // Insert a cell in the row at index 0
    const newCell = newRow.insertCell(0);
    // Append a text node to the cell
    newCell.appendChild(document.createTextNode('Accordion (seo)'));
    
    if (items) {
      items.forEach((item) => {

        const text = document.createTextNode(item.querySelector('.spectrum-Accordion-itemHeader').textContent);
        const content = item.querySelector('.spectrum-Accordion-itemContent');

        // remove br as they wrongly add a "\" character in the output
        WebImporter.DOMUtils.remove(content, [ 'br' ]);

        // Insert a row at the end of the table
        const newRow = tableRef.insertRow(-1);
        // Insert a cell in the row at index 0
        const newCell = newRow.insertCell(0);
        // Append a text node to the cell
        newCell.appendChild(text);

        // Insert a row at the end of the table
        const newRow2 = tableRef.insertRow(-1);
        // Insert a cell in the row at index 0
        const newCell2 = newRow2.insertCell(0);
        // Append a text node to the cell
        newCell2.appendChild(content);
      });

      accordion.insertAdjacentElement('beforebegin', tableRef);

      accordion.remove();
    }
  });

};

// TODO - render proper section/block
const createFeedbackBlock = (main, document) => {
  const el = document.querySelector('.feedback');
  if (el) {
    el.remove();
  }

  const el2 = document.querySelector('#root_feedback_xfreference');
  if (el2) {
    el2.remove();
  }

};

const createTitleBlock = (main, document) => {

  /*
    search
  */
 // TODO - render proper search section/block
 document.querySelector('#search-container').remove();
 document.querySelector('.back-to-search').remove();

  /*
    title
  */

  let title = '';

  const el = document.querySelector('.titleBar h1');
  if (el) {
    title = el.textContent;
  }

  // el.insertAdjacentElement('beforebegin', document.createElement('hr'));

  const div = document.createElement('h2');
  div.innerHTML = title;
  el.insertAdjacentElement('beforebegin', div);
    
  const cells = [
    ['Section Metadata'],
    ['style', 'dark, l spacing'],
    ['background', ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  el.insertAdjacentElement('beforebegin', table);

  // el.insertAdjacentElement('beforebegin', document.createElement('hr'));

  el.remove();
};

const createDescriptionBlock = (main, document) => {
  /*
    description
  */

  let description = '';

  const el = document.querySelector('.page-description p');
  if (el) {
    description = el.textContent;

    const div = document.createElement('h3');
    div.innerHTML = description;
    el.insertAdjacentElement('beforebegin', div);
  
    el.remove();
  }
};

const createInternalBannerBlock = (main, document) => {
  const note = {};

  // find the .helpx-note element
  const el = document.querySelector('.internalBanner');

  el.insertAdjacentElement('beforebegin', document.createElement('hr'));

  // const div = document.createElement('div');
  // div.innerHTML = 'INTERNAL';
  // el.insertAdjacentElement('beforebegin', div);
    
  const cells = [
    ['internal-banner'],
  ];

  const dateEl = el.querySelector('.applies-to-container');
  if (dateEl) {
    const date = dateEl.textContent.replace(/\s+/gm, ' ').trim();
    cells.push(['text', date]);
    // const div = document.createElement('div');
    // div.innerHTML = date;
    // el.insertAdjacentElement('beforebegin', div);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  el.insertAdjacentElement('beforebegin', table);

  el.insertAdjacentElement('beforebegin', document.createElement('hr'));

  el.remove();
  // returning the meta object might be usefull to other rules
  // return meta;
};

const createTableBlocks = (main, document) => {
  

  const tables = document.querySelectorAll('table');

  tables.forEach((tableEl) => {
    /*
      exclusions
    */
    // table inside an accordion, the import helper (in this file)
    // will already put the table in a table cell
    if (tableEl.closest('.spectrum-Accordion-item')) {
      return;
    }

    const clone = tableEl.cloneNode(true);

    const tableRef = document.createElement('table');
    // Insert a row at the end of the table
    const newRow = tableRef.insertRow(-1);
    // Insert a cell in the row at index 0
    const newCell = newRow.insertCell(0);
  
    // Append a text node to the cell
    newCell.appendChild(clone);
  
    tableEl.insertAdjacentElement('beforebegin', tableRef);
    tableEl.remove();
  
  });

  // const cells = [
  //   [],
  // ];
  // const tableBlock = WebImporter.DOMUtils.createTable(cells, document);
  
  // // append the block to the main element
  // noteEl.insertAdjacentElement('beforebegin', table);

  // returning the meta object might be usefull to other rules
  // return meta;
};

const createNoteBlock = (main, document) => {
  const note = {};

  // find the .helpx-note element
  const noteEl = document.querySelector('.helpx-note');

  // nothing to do, return fast
  if (!noteEl) {
    return;
  }

  // find the title text
  const title = noteEl.querySelector('.note-title');
  if (title) {
    note.title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // find the text
  const text = noteEl.querySelector('.cmp-text');
  if (text) {
    note.text = text.innerHTML.replace(/[\n\t]/gm, '');
  }
  
  const cells = [
    ['Section Metadata'],
    ['style', 'note'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // append the block to the main element
  noteEl.insertAdjacentElement('beforebegin', document.createElement('hr'));
  const el = document.createElement('div');
  el.innerHTML = note.text;

  noteEl.insertAdjacentElement('beforebegin', el);
  noteEl.insertAdjacentElement('beforebegin', table);
  noteEl.insertAdjacentElement('beforebegin', document.createElement('hr'));

  // returning the meta object might be usefull to other rules
  // return meta;
};

// TODO - render proper block/section for this content
const createToCBlock = (main, document) => {
  // const cells = [
  //   ['Table of contents'],
  //   ['Sign In Block'],
  //   ['On this page'],
  // ];
  // const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // // append the block to the main element
  // main.append(table);


  const el = document.querySelector('.xfreference');
  if (el) {
    const parent = el.closest('.position');
    if (parent) {
      parent.remove();
    }
  }
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    const main = document.body;

    /*
      blocks
    */

    /*
      blocks
    */

    createTableBlocks(main, document);

    createMetadataBlock(main, document);

    createFeedbackBlock(main, document);

    createAccordionBlocks(main, document);

    createTitleBlock(main, document);

    createDescriptionBlock(main, document);

    createInternalBannerBlock(main, document);

    createNoteBlock(main, document);

    createToCBlock(main, document);


    /*
      clean
    */

      // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      '.modalContainer',
      '.globalNavFooter',
      'locale-modal',
      'header',
      'footer',
      '.helpx-note',
      // right top side menu, display none in original page
      '.plan-card__sections',
      '.plan-card-i18nData',
      // '.position:has(.xfreference)',
    ]);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''),
};
