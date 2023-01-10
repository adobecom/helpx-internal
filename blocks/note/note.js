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

import { readBlockConfig } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  const $text = block.querySelector('div:first-of-type');
  if ($text) {
    $text.classList.add('content');

    if (cfg.type) {
      block.classList.add(cfg.type);
    }
    block.textContent = '';
    /*
      build container elements
    */
  
    block.append($text);

    const icon = document.createElement('div');
    icon.classList.add('icon');
    block.append(icon);
  }
}
