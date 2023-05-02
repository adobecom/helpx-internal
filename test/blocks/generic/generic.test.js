/* eslint-disable no-unused-expressions */
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/generic/generic.js');

const initialHTML = '<div class="generic"><div></div></div>';
document.body.innerHTML = initialHTML;
const generic = document.querySelectorAll('.generic');
[...generic].forEach(decorate);

describe('generic', () => {
  it('should do absolutely nothing', async () => {
    expect(document.body.innerHTML).to.equal(initialHTML);
  });
});
