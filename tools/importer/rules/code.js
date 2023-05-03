const getLanguage = (lang) => {
  switch (lang.toLowerCase()) {
    case 'cf':
      return 'coldfusion';
    case 'c++':
      return 'cpp';
    default:
      return lang.toLowerCase();
  }
};

const createCodeBlock = (document) => {
  const codeblocks = document.querySelectorAll('.codeblock');
  codeblocks.forEach((codeblock) => {
    const pre = codeblock.querySelector('pre');
    const content = pre.textContent;
    const newPre = document.createElement('pre');
    const newCode = document.createElement('code');
    newPre.appendChild(newCode);
    newCode.textContent = content;
    const cells = [
      [`code (language-${getLanguage(pre.dataset.enlighterLanguage)}${pre.dataset.gutter
        ? ', line-numbers'
        : ''})`],
      [newPre],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    codeblock.insertAdjacentElement('beforebegin', table);
    codeblock.remove();
  });
};

export default createCodeBlock;
