export const setTooltipContent = function (data) {
  const msg = Object.entries(data).reduce((acc, [key, value]) => {
    return acc + `<li>${key}:  ${value}</li>`;
  }, '');
  return `<ul style="list-style: none;">${msg}</ul>`;
};
