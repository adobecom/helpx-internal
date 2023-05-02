/* eslint-disable no-unused-expressions */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/download/download.js');

document.body.innerHTML = await readFile({ path: './mocks/download.html' });
const download = document.querySelector('.download');
decorate(download);

describe('download', () => {
  it('should add the download-button class to the <a> elements', () => {
    const as = download.querySelectorAll('a');
    as.forEach((a) => {
      expect([...a.classList]).to.deep.include('download-button');
    });
  });
  it('should add a title to the download section', () => {
    const title = download.firstChild;
    expect([...title.classList]).to.deep.include('download-title');
    expect(title.textContent.toLowerCase()).to.equal('download');
  });
});
