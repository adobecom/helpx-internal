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

const createTableBlocks = (main, document) => {
  

  let tables = document.querySelectorAll('table');

  tables.forEach((tableEl) => {
    const clone = tableEl.cloneNode(true);

    let tableRef = document.createElement('table');
    // Insert a row at the end of the table
    let newRow = tableRef.insertRow(-1);
    // Insert a cell in the row at index 0
    let newCell = newRow.insertCell(0);
  
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
    ['Style', 'note'],
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

const createToCBlock = (main, document) => {
  // const toc = {};

  // // find the .helpx-note element
  // const noteEl = document.querySelector('.helpx-note');

  // // find the title text
  // const title = noteEl.querySelector('.note-title');
  // if (title) {
  //   note.title = title.innerHTML.replace(/[\n\t]/gm, '');
  // }

  // // find the text
  // const text = noteEl.querySelector('.cmp-text');
  // if (text) {
  //   note.text = text.innerHTML.replace(/[\n\t]/gm, '');
  // }
  
  const cells = [
    ['Table of contents'],
    ['Sign In Block'],
    ['On this page'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // append the block to the main element
  main.append(table);

  // returning the meta object might be usefull to other rules
  // return meta;
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

    createTableBlocks(main, document);

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
