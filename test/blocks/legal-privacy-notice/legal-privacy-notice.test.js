/* eslint-disable no-unused-expressions */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import('../../../blocks/legal-privacy-notice/legal-privacy-notice.js');
document.body.innerHTML = await readFile({ path: './mocks/legal-privacy-notice.html' });
const notice = document.querySelector('.legal-privacy-notice');
decorate(notice);

describe('Legal and Privacy Notice', () => {
  it('should have this precise HTML every time', () => {
    expect(document.querySelector('.legal-privacy-notice').outerHTML).to.equal('<p class="legal-privacy-notice"><a href="/content/help/en/legal/legal-notices" class="link">Legal Notices</a><span>    |    </span><a href="https://www.adobe.com/privacy.html" class="link">Online Privacy Policy</a></p>');
  });
});
