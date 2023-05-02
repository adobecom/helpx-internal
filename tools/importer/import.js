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

/*
  import rules
*/

import transformNotes from './rules/notes.js';
import createMetadataBlock from './rules/metadata.js';
import createAccordionBlocks from './rules/accordions.js';
import createFeedbackBlock from './rules/feedback.js';
import createTitleBlock from './rules/title.js';
import createDescriptionBlock from './rules/description.js';
import createInternalBannerBlock from './rules/internal-banner.js';
import createTableBlocks from './rules/tables.js';
// import createToCBlock from './rules/toc.js';
import createColumnsFromDexterFlexContainers from './rules/dexter-flexcontainers.js';
import createBeforeAfterSliders from './rules/before-and-after.js';
import createVideosEmbed from './rules/videos.js';
import importProcedure from './rules/procedure.js';
import importLegalPrivacy from './rules/legal-privacy-notice.js';

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

    createMetadataBlock(main, document);

    createFeedbackBlock(main, document);

    createAccordionBlocks(main, document);

    createTitleBlock(main, document);

    createDescriptionBlock(main, document);

    createInternalBannerBlock(main, document);

    transformNotes(main, document);

    createToCBlock(main, document);

    createColumnsFromDexterFlexContainers(main, document);

    createBeforeAfterSliders(main, document);

    createVideosEmbed(main, document);

    importProcedure(document);

    importLegalPrivacy(document);

    /*
      clean
    */

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      '.modalContainer',
      '.globalNavHeader',
      '.tableOfContents-mobile-drawer',
      '.globalNavFooter',
      'locale-modal',
      'iframe',
      'img[style="display:none"]',
      'img[style="display:none;"]',
      'img[style="display:none;"]',
      'img[style="display: none;"]',
      'img[height="0"][width="0"]',
      'header',
      'footer',
      // 'script',
      // 'style',
      '#adbMsgClientWrapper',
      '.helpx-note',
      '#onetrust-consent-sdk',
      '#ot-general',
      '#ot-enable-disabled',
      // right top side menu, display none in original page
      '.plan-card',
      // '.position:has(.xfreference)',
      '#sidebar',
      '#internal-article-bar-container',
    ]);

    return main;
  },

};
