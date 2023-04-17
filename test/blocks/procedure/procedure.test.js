/* eslint-disable no-unused-expressions */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/procedure/procedure.js');

describe('procedure', () => {
  it('correctly decorates the procedure block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/procedure.html' });
    const procedure = document.querySelector('.procedure');
    expect(procedure).to.exist;
    decorate(document.querySelector('.procedure'));
    expect(procedure.firstChild.tagName).to.equal('OL');
    expect([...procedure.firstChild.classList])
      .to.deep.include('stepList');
    [...procedure.firstChild.children].map((child) => {
      expect(child.tagName).to.equal('LI');
      expect([...child.classList]).to.deep.include('step');
      return null;
    });
  });
});
