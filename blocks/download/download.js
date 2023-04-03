export default (block) => {
  [...block.children].forEach((child) => {
    const a = child.querySelector('a');
    a.classList.add('download-button');
    a.setAttribute('download', 'download');
  });
  const p = document.createElement('p');
  p.classList.add('download-title');
  p.textContent = 'Download';
  block.insertAdjacentElement('afterbegin', p);
};
