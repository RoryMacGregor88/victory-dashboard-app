import { alpha, useTheme } from '@material-ui/core';
import deepmerge from 'deepmerge';

import { ChartColors, ChartTheme, TenureCategory } from '../types';

const colors = [
  '#f6be00',
  '#37e5d8',
  '#05c3ff',
  '#75b7b2',
  '#d6ea69',
  '#8189f3',
  '#d76781',
  '#ffa048',
];

const chartColors: ChartColors = {
  totalHousingDelivery: ['#37e5d8', '#8189f3'],
  tenureHousingDelivery: [''],
  progressionVsPlanning: ['#37e5d8', '#d6ea69', '#05c3ff'],
  affordableHousingDelivery: ['#f6be00'],
  approvalsGranted: ['#f6be00', '#af31d6'],
  deliverableSupplySummary: ['#8aea73', '#d76781', '#37e5d8', '#ffa048'],
};

const tenureStackColors: { [key in TenureCategory]: string } = {
  affordableHousing: '#37e5d8',
  affordableHousingLondon: '#aaeaff',
  intermediateDelivery: '#75b7b2',
  intermediateOther: '#61d767',
  marketHousing: '#adeab0',
  sociallyRented: '#05c3ff',
};

const baseProps = {
  colorScale: colors,
  animate: true,
};

const strokeLinecap = 'round';
const strokeLinejoin = 'round';

export const useChartTheme = (): ChartTheme => {
  const materialTheme = useTheme();

  const baseLabelStyles = {
    ...materialTheme.typography.body1,
    fontSize: 14,
    fill: materialTheme.palette.text.primary,
    stroke: 'transparent',
  };

  const centeredLabelStyles = deepmerge(baseLabelStyles, {
    textAnchor: 'middle',
  });

  const baseAxisStyles = {
    style: {
      axis: {
        fill: 'transparent',
        stroke: materialTheme.palette.text.primary,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin,
      },
      axisLabel: deepmerge(centeredLabelStyles, {
        padding: 40,
        fill: materialTheme.palette.primary.main,
      }),
      grid: {
        fill: 'none',
        strokeDasharray: 5,
        pointerEvents: 'painted',
      },
      ticks: {
        fill: 'transparent',
        size: 1,
        stroke: 'transparent',
      },
      tickLabels: deepmerge(baseLabelStyles, {
        padding: 10,
        fill: materialTheme.palette.text.primary,
      }),
    },
  };

  return {
    colors,
    chartColors,
    tenureStackColors,
    fontSize: 14,
    independentAxis: deepmerge(baseAxisStyles, {
      style: {
        grid: {
          stroke: 'transparent',
        },
      },
    }),
    dependentAxis: deepmerge(baseAxisStyles, {
      style: {
        grid: {
          stroke: alpha(materialTheme.palette.text.disabled, 0.2),
        },
      },
    }),
    bar: deepmerge(baseProps, {
      style: {
        labels: baseLabelStyles,
      },
      barRatio: 0.8,
    }),
    chart: deepmerge(baseProps, {
      padding: { left: 80, top: 20, bottom: 60, right: 10 },
    }),
    stack: {
      colorScale: colors,
    },
    legend: {
      colorScale: colors,
      style: {
        data: {
          borderRadius: 0,
        },
        labels: baseLabelStyles,
      },
    },
    line: {
      style: {
        data: {
          stroke: materialTheme.palette.primary.main,
          strokeWidth: 2,
        },
      },
    },
    scatter: {
      style: {
        data: {
          stroke: materialTheme.palette.primary.dark,
          strokeWidth: 2,
          fill: materialTheme.palette.primary.main,
        },
      },
    },
  };
};
