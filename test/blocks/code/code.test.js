import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const { default: decorate } = await import('../../../blocks/code/code.js');

describe('code', () => {
  it('correctoly decorates the text to be highlighted', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/code.html' });
    const block = document.querySelector('.code');
    decorate(block);
    const pre = document.querySelector('pre');
    expect([...block.classList]).to.deep.include('line-numbers');
    expect([...pre.classList]).to.deep.include('language-clike');
  });
});
