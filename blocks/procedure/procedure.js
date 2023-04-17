export default (block) => {
  const ol = document.createElement('ol');
  ol.classList.add('stepList');
  [...block.children].map((child) => {
    const li = document.createElement('li');
    li.classList.add('step');
    li.replaceChildren(...child.children);
    ol.appendChild(li);
    return null;
  });
  block.replaceChildren(ol);
};
