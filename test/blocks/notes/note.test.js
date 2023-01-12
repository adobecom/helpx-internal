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

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/note/note.js');

describe('note', () => {

  it('renders a simple note', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    decorate(document.querySelector('.note'));

    expect(document.querySelector('.note')).to.exist;
    expect(document.querySelector('.note .content')).to.exist;
    expect(document.querySelector('.note .icon')).to.exist;
  });

  it('renders a caution note', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/caution.html' });
    decorate(document.querySelector('.note'));

    expect(document.querySelector('.note.caution')).to.exist;
    expect(document.querySelector('.note.caution .content')).to.exist;
    expect(document.querySelector('.note.caution .icon')).to.exist;
  });

  it('renders an alert note', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/alert.html' });
    decorate(document.querySelector('.note'));

    expect(document.querySelector('.note.alert')).to.exist;
    expect(document.querySelector('.note.alert .content')).to.exist;
    expect(document.querySelector('.note.alert .icon')).to.exist;
  });

});