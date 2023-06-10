import React from 'react';

import { VictoryLegend, VictoryPie } from 'victory';

import { COLORS } from '../../NatureScot/nature-scotland.constants';

const DATA = [
  { x: 1, y: 50 },
  { x: 2, y: 50 },
  { x: 3, y: 50 },
  { x: 4, y: 50 },
  { x: 5, y: 50 },
];

const LEGEND = [
  { name: 'Warning' },
  { name: 'Not Good' },
  { name: 'Neutral' },
  { name: 'Good' },
  { name: 'Very Good' },
];

const WIDTH = 300;
const HEIGHT = 300;

const Pointer = () => (
  <path
    d="m149.41 70.207c-0.79596-0.038617-1.6406 0.62231-2.5391 2.0742l-2.5566 63.672a7.9817 7.9817 0 0 0-2.7832 6.0527 7.9817 7.9817 0 0 0 7.9824 7.9824 7.9817 7.9817 0 0 0 7.9824-7.9824 7.9817 7.9817 0 0 0-2.8301-6.0938l-3.0059-63.588c-0.70632-1.3418-1.454-2.0786-2.25-2.1172z"
    fill="#fff"
  />
);

const GaugeChart = ({ data = DATA, legend = LEGEND }) => (
  <div>
    <svg viewBox={`0 0 ${WIDTH} 200`}>
      <VictoryPie
        standalone={false}
        startAngle={-90}
        endAngle={90}
        width={WIDTH}
        height={HEIGHT}
        data={data}
        innerRadius={WIDTH / (data.length + 1 * 10)}
        colorScale={COLORS}
      />

      <Pointer />
    </svg>

    <VictoryLegend
      x={100}
      // y={-100}
      data={legend}
      gutter={20}
      style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
      colorScale={COLORS}
      itemsPerRow={2}
    />
  </div>
);

export { GaugeChart };
