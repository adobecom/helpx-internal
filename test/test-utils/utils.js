const getMiddleOfElement = (element) => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
};

const f = () => { };

export { getMiddleOfElement, f };
