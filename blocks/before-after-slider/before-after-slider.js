
export default function decorate(block) {
  
  /*
   * build container elements
   */

  block.classList.add('content');

  // get original images
  const imageEls = block.querySelectorAll('img');
  let img1El = imageEls[0];
  let img2El = imageEls[1];

  // reset block content to dry slider input
  block.innerHTML = sliderInput;

  // add after image element
  let afterDiv = document.createElement('div');
  afterDiv.classList.add('after');
  let afterImg = document.createElement('img');
  afterImg.src = img2El.src;
  afterDiv.append(afterImg);
  block.prepend(afterDiv);
  
  // add before image element
  block.prepend(img1El);

  /*
   * add js animation
   */

  const slider = block;
  const sliderImgWrapper = block.querySelector(":scope > .after");
  const sliderHandle = block.querySelector(":scope > .slider");
  
  slider.addEventListener("mousemove", sliderMouseMove);
  slider.addEventListener("touchmove", sliderMouseMove);
  
  let locked = true;
  
  slider.addEventListener("mousedown", sliderMouseDown);
  slider.addEventListener("touchstart", sliderMouseDown);
  slider.addEventListener("mouseup", sliderMouseUp);
  slider.addEventListener("touchend", sliderMouseUp);
  slider.addEventListener("mouseleave", sliderMouseLeave);
  
  function sliderMouseMove(event) {
    if(locked) {
      return;
    } 
  
    const sliderLeftX = slider.offsetLeft;
    const sliderWidth = slider.clientWidth;
    const sliderHandleWidth = sliderHandle.clientWidth;
  
    let mouseX = (event.clientX || event.touches[0].clientX) - sliderLeftX;
    if(mouseX < 0) mouseX = 0;
    else if(mouseX > sliderWidth) mouseX = sliderWidth;
  
    sliderImgWrapper.style.width = `${((1 - mouseX/sliderWidth) * 100).toFixed(4)}%`;
    sliderHandle.style.left = `calc(${((mouseX/sliderWidth) * 100).toFixed(4)}% - ${sliderHandleWidth/2}px)`;
  }
    
  function sliderMouseDown(event) {
    if(locked) {
      locked = false;
    } 
    sliderMouseMove(event);
  }
  
  function sliderMouseUp() {
    if(!locked) {
      locked = true;
    } 
  }
  
  function sliderMouseLeave() {
    if(locked) {
      locked = false;
    }
  }

}

const sliderInput = `<div class="slider">
  <div class="separator"></div>
  <div class="slider-input"></div>
  <div class="separator"></div>
</div>`;
