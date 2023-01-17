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

const { default: decorate } = await import('../../../blocks/before-after-slider/before-after-slider.js');

describe('before/after image slider', () => {

  it('renders a before/after image slider', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    decorate(document.querySelector('.before-after-slider'));

    expect(document.querySelector('.before-after-slider')).to.exist;
    expect(document.querySelector('.before-after-slider .after')).to.exist;
    expect(document.querySelector('.before-after-slider .slider')).to.exist;
  });

  it('slildes on mouse down', async () => {
    // init block
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.before-after-slider');
    decorate(el);
    
    // get image client width before mouse move
    let afterImgEl = document.querySelector('.before-after-slider .after');
    const originalAfterImgW = afterImgEl.clientWidth;

    // dispatch mouse down event to force sliding
    const event = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 100,
      'clientY': 100
    });
    el.dispatchEvent(event);
    
    // get image client width after mouse move
    const afterMoveAfterImgW = afterImgEl.clientWidth;

    expect(originalAfterImgW).to.be.above(afterMoveAfterImgW);
  });

  it('stops sliding on mouse up', async () => {
    // init block
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.before-after-slider');
    decorate(el);
    
    // get image client width before mouse move
    let afterImgEl = document.querySelector('.before-after-slider .after');
    const originalAfterImgW = afterImgEl.clientWidth;

    // dispatch mouse down event to force sliding
    let event = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 100,
      'clientY': 100
    });
    el.dispatchEvent(event);
    
    // get image client width after mouse move
    const afterMoveAfterImgW = afterImgEl.clientWidth;

    expect(originalAfterImgW).to.be.above(afterMoveAfterImgW);

    // dispatch mouse down event to force sliding
    event = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 100,
      'clientY': 100
    });
    el.dispatchEvent(event);

    // dispatch mouse down event to force sliding
    event = new MouseEvent('mousemove', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 300,
      'clientY': 150
    });
    el.dispatchEvent(event);

    expect(afterMoveAfterImgW).to.be.equal(afterImgEl.clientWidth);

  });

  it('unlocks the slider on mouseleave', async () => {
    // init block
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.before-after-slider');
    decorate(el);
    
    // get image client width before mouse move
    let afterImgEl = document.querySelector('.before-after-slider .after');
    const originalAfterImgW = afterImgEl.clientWidth;

    // dispatch mouse down event to force sliding
    let event = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 100,
      'clientY': 100
    });
    el.dispatchEvent(event);
    
    // get image client width after mouse move
    const afterMoveAfterImgW = afterImgEl.clientWidth;

    expect(originalAfterImgW).to.be.above(afterMoveAfterImgW);

    // dispatch mouse down event to force sliding
    event = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 100,
      'clientY': 100
    });
    el.dispatchEvent(event);

    // dispatch mouse down event to force sliding
    event = new MouseEvent('mouseleave', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    el.dispatchEvent(event);

    // dispatch mouse down event to force sliding
    event = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': 10,
      'clientY': 100
    });
    el.dispatchEvent(event);

    expect(afterMoveAfterImgW).to.be.below(afterImgEl.clientWidth);

  });

});
