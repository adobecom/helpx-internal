export default (block) => {
  const a = document.createElement('a');
  const container = document.createElement('div');
  container.classList.add('go-to-top');
  a.textContent = block.textContent;
  a.href = '#';
  a.target = '_top';
  a.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' })
  });
  container.append(a);
  block.insertAdjacentElement('beforebegin', container);
  block.remove();
}
