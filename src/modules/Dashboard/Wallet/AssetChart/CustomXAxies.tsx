import React from 'react';

interface Props {
  x: number;
  y: number;
  payload: any;
}

export const CustomXAxies: React.FC<Props> = (props) => {
  const {x, y, payload} = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-10} y={30} textAnchor='start' fill='#666'>
        {payload.value}
      </text>
    </g>
  );
};
