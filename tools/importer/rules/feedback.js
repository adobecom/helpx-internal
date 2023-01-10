
// FOR NOW ONLY REMOVE IT
// TODO - render proper section/block
export default function createFeedbackBlock(main, document) {
  const el = document.querySelector('.feedback');
  if (el) {
    el.remove();
  }

  const el2 = document.querySelector('#root_feedback_xfreference');
  if (el2) {
    el2.remove();
  }
};
