import { setupTooltip } from '@/composables/chart.js';

export const setupMarksChart = ({ emit }) => {
  const { onMouseOver: updateTooltip, setTooltipContent } = setupTooltip();

  const onMouseOver = (event, gene) => {
    updateTooltip(event);
    emit('update:modelValue', gene.gene);
  };

  const onMouseLeave = () => {
    emit('update:modelValue', null);
  };
  return { onMouseOver, onMouseLeave, setTooltipContent };
};
