/* eslint-disable no-unused-expressions */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/before-after-slider/before-after-slider.js');
const { getMiddleOfElement } = await import('../../test-utils/utils.js');

document.body.innerHTML = await readFile({ path: './mocks/before-after-slider.html' });
const beforeafter = document.querySelectorAll('.before-after-slider');
[...beforeafter].forEach(decorate);

describe('before-after-slider', () => {
  it('should correctly decorate both the horizontal and vertical before/after block', async () => {
    const children = [...document.querySelector('.before-after-slider').children];
    expect([...children[0].classList]).to.deep.include('image');
    expect([...children[0].classList]).to.deep.include('before');
    expect([...children[1].classList]).to.deep.include('image');
    expect([...children[1].classList]).to.deep.include('after');
    expect(children[2].tagName).to.equal('INPUT');
    expect([...children[3].classList]).to.deep.include('slider-thumb-container');
  });

  it('should respond to input', () => {
    const thumb = document.querySelector('.before-after-slider > div.slider-thumb-container');
    const input = document.querySelector('.before-after-slider > input');
    input.value = 55;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.value).to.equal('55');
    expect(thumb.style.left).to.equal('55%');

    const vThumb = document.querySelector('.before-after-slider.vertical > div.slider-thumb-container');
    const vInput = document.querySelector('.before-after-slider.vertical > input');
    vInput.value = 45;
    vInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(vInput.value).to.equal('45');
    expect(vThumb.style.top).to.equal('55%');
  });
});
