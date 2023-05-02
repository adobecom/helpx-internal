export default (block) => {
  const legal = document.createElement('a');
  legal.href = '/content/help/en/legal/legal-notices';
  legal.textContent = 'Legal Notices';
  legal.classList.add('link');

  const privacy = document.createElement('a');
  privacy.href = 'https://www.adobe.com/privacy.html';
  privacy.textContent = 'Online Privacy Policy';
  privacy.classList.add('link');

  const divider = document.createElement('span');
  divider.textContent = '    |    ';

  const p = document.createElement('p');
  p.classList.add('legal-privacy-notice');
  p.replaceChildren(legal, divider, privacy);
  block.insertAdjacentElement('beforebegin', p);
  block.remove();
};
