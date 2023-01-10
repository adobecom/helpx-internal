
export default function createDescriptionBlock(main, document) {
  const el = document.querySelector('.page-description p');

  if (el) {
    const div = document.createElement('h3');
    div.innerHTML = el.textContent;

    el.insertAdjacentElement('beforebegin', div);
  
    el.remove();
  }
};
