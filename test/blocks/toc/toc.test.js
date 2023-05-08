/* eslint-disable no-unused-expressions */
import { readFile, sendKeys, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/toc/toc.js');

document.body.innerHTML = await readFile({ path: './mocks/toc.html' });
const toc = document.querySelector('.toc');
decorate(toc);

describe('Table of Contents', () => {
  it('adds all the relevant aria roles', () => {
    expect(toc.role).to.equal('tree');
    window.dispatchEvent(new Event('main-elements-loaded'));
    toc.querySelectorAll(':scope li').forEach((li) => {
      expect(li.role).to.be.oneOf(['treeitem', 'group']);
      expect(li.tabIndex).to.equal(-1);
    });
  });
  it('should handle clicks correctly', () => {
    const li = document.querySelector('li[role="group"]');
    li.click();
    expect(li.ariaExpanded).to.equal('true');
  });
  it('mobile should behave correctly', async () => {
    const tocButton = document.querySelector('.toc-mobile-drawer');
    tocButton.click();
    expect(document.querySelector('.modal-container').classList[1]).to.equal('show');
    document.querySelector('.modal-container').click();
    expect(document.querySelector('.modal-container').classList[1]).to.not.equal('show');
    await setViewport({ width: 1200, height: 700 });
    expect(toc.parentElement).to.equal(document.querySelector('body'));
    await setViewport({ width: 360, height: 500 });
    window.dispatchEvent(new Event('resize'));
    expect(toc.parentElement).to.equal(document.querySelector('.toc-modal'));
  });
  it('should respond to keyboard input', () => {
    const li = toc.querySelector('li');
    li.focus();
    sendKeys({ press: 'ArrowDown' });
    sendKeys({ press: 'Enter' });
    sendKeys({ press: 'Enter' });
    sendKeys({ press: 'Enter' });
    sendKeys({ press: 'ArrowDown' });
    sendKeys({ press: 'ArrowDown' });
    sendKeys({ press: 'ArrowDown' });
    sendKeys({ press: 'ArrowDown' });
    sendKeys({ press: 'ArrowUp' });
    sendKeys({ press: 'ArrowUp' });
    sendKeys({ press: 'Enter' });
    sendKeys({ press: 'ArrowDown' });
    sendKeys({ press: 'Shift' });
    sendKeys({ press: 'Enter' });
    // expect(
    // document.querySelector('li[aria-expanded="true"]'),
    // ).to.not.equal(null);
  });
});
