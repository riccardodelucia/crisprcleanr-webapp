import tippy from 'tippy.js';

export const getInnerChartSizes = function (width, height, margin) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { innerWidth, innerHeight };
};

export const setupTooltip = function () {
  const setTooltipContent = function (data) {
    const msg = Object.entries(data).reduce((acc, [key, value]) => {
      return acc + `${key}: ${value} <br />`;
    }, '');
    return msg;
  };
  const onMouseOver = (event) => {
    //Note: it has been demonstrated that creating multiple tippies doesn't increase the overall number of DOM elements over time
    tippy(event.target, { duration: 0, allowHTML: true });
  };
  return { setTooltipContent, onMouseOver };
};

export const augmentedExtent = (data, augmentation = 0.05) => {
  const scaleMin = Math.min(...data);
  const scaleMax = Math.max(...data);

  const standardExtent = Math.abs(scaleMax - scaleMin);
  return [
    scaleMin - standardExtent * augmentation,
    scaleMax + standardExtent * augmentation,
  ];
};
