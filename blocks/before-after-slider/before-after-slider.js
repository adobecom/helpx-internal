
export default function decorate(block) {

  /*
    build container elements
  */

  // slider container
  const container = document.createElement('div');
  container.classList.add('container');

  const imageEls = block.querySelectorAll('img');
  let img1El = imageEls[0];
  let img2El = imageEls[1];

  // background image element
  const bImgEl = document.createElement('div');
  bImgEl.classList.add('img');
  bImgEl.classList.add('background-img');
  bImgEl.style.backgroundImage = `url('${img1El.getAttribute('src')}')`;

  // foreground image element
  const fImgEl = document.createElement('div');
  fImgEl.classList.add('img');
  fImgEl.classList.add('foreground-img');
  fImgEl.style.backgroundImage = `url('${img2El.getAttribute('src')}')`;

  container.innerHTML = sliderInput;
  container.prepend(fImgEl);
  container.prepend(bImgEl);

  /*
    add js animation
  */

  // slider animation / before/after effect
  const sliderBtn = container.querySelector('.slider-button');
  const sliderEl = container.querySelector("#slider");
  const slideHdler = (e)=>{
    const sliderPos = e.target.value;
    // Update the width of the foreground image
    fImgEl.style.width = `${sliderPos}%`;
    // Update the position of the slider button
    sliderBtn.style.left = `calc(${sliderPos}% - 18px)`;
  };
  sliderEl.addEventListener("input", slideHdler);
  sliderEl.addEventListener("change", slideHdler);


  /*
    append block output
  */

  // add the rendered block at the original location
  block.insertAdjacentElement('beforebegin', container);

  // delete the original block
  block.remove();
}

const sliderInput = `<input type="range" min="1" max="100" value="50" class="slider" name='slider' id="slider">
<div class='slider-button'></div>`;
