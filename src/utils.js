import lodash from 'lodash-es';
import deepdash from 'deepdash-es';
const _ = deepdash(lodash);

export const setTooltipContent = function (data) {
  const msg = Object.entries(data).reduce((acc, [key, value]) => {
    return acc + `<li>${key}:  ${value}</li>`;
  }, '');
  return `<ul style="list-style: none;">${msg}</ul>`;
};

export function date(dateTime) {
  const date = new Date(Date.parse(dateTime));
  return date.toLocaleString();
}

export function interceptorCamelize(response) {
  // if this is a multipart file response, there is nothing to camelize
  if (response.headers['content-type'] === 'application/json') {
    const res = _.mapKeysDeep(response.data, function (__, key) {
      return _.camelCase(key);
    });
    response.data = res;
  }

  return response;
}

export function download(data, filename) {
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(data); // data must be instaceof Blob

  link.setAttribute('download', filename);

  document.body.appendChild(link);

  link.click();

  link.remove();
  URL.revokeObjectURL(link.href);
}

export const augmentedExtent = (data, augmentation = 0.05) => {
  const scaleMin = Math.min(...data);
  const scaleMax = Math.max(...data);

  const standardExtent = Math.abs(scaleMax - scaleMin);
  return [
    scaleMin - standardExtent * augmentation,
    scaleMax + standardExtent * augmentation,
  ];
};

export const getInnerChartSizes = function (width, height, margin) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { innerWidth, innerHeight };
};
