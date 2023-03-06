const makeSliderThumb = () => {
  const thumbContainer = document.createElement('div');
  thumbContainer.classList.add('slider-thumb-container');

  const sliderThumb = document.createElement('div');
  sliderThumb.classList.add('slider-thumb');
  const leftArrow = document.createElement('i');
  leftArrow.classList.add('left-arrow');
  const rightArrow = document.createElement('i');
  rightArrow.classList.add('right-arrow');
  sliderThumb.replaceChildren(leftArrow, rightArrow);

  const beforeThumb = document.createElement('div');
  const afterThumb = document.createElement('div');
  beforeThumb.classList.add('before-thumb');
  afterThumb.classList.add('after-thumb');

  thumbContainer.replaceChildren(beforeThumb, sliderThumb, afterThumb);
  return thumbContainer;
};

export default (block) => {
  [...block.children].map((child, index) => {
    child.classList.add('image');
    child.classList.add(index === 0 ? 'before' : 'after');
    return null;
  });
  const isVertical = block.classList.contains('vertical');
  const slider = document.createElement('input');
  if (isVertical) slider.setAttribute('orient', 'vertical');
  const sliderThumb = makeSliderThumb();
  slider.type = 'range';
  slider.min = 0;
  slider.max = 100;
  slider.value = 50;
  slider.step = 'any';
  slider.classList.add('slider');
  slider.addEventListener('input', (e) => {
    const imgBefore = block.querySelector('.image.before');
    if (isVertical) {
      imgBefore.style.clipPath = `inset(0 0 ${e.target.value}% 0)`;
      sliderThumb.style.top = `${100 - e.target.value}%`;
    } else {
      imgBefore.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
      sliderThumb.style.left = `${e.target.value}%`;
    }
  });
  block.appendChild(slider);
  block.appendChild(sliderThumb);
  const img = block.querySelector('.image.before');
  const resizeSlider = () => {
    block.style.setProperty(
      '--slider-height',
      `${img.offsetHeight - 2}px`,
    );
  };
  new ResizeObserver(resizeSlider).observe(img);
};
