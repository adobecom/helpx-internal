export function addRow(table, content) {
  const newRow = table.insertRow(-1);
  const newCell = newRow.insertCell(0);
  newCell.appendChild(content);
}
export const replaceNode = (oldNode, newElement) => {
  oldNode.insertAdjacentElement('beforebegin', newElement);
  newElement.replaceChildren(...oldNode.children);
  oldNode.remove();
};
