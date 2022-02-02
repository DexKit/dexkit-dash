import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {ChartTick} from 'types/app';

interface AssetChartProps {
  data: ChartTick[];
}

const AssetChart: React.FC<AssetChartProps> = ({data}) => {
  const formatXAxis = (tickItem: any) => {
    if (tickItem) {
      return tickItem; //.toLocaleDateString();
    }
  };

  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data} margin={{top: 0, right: 0, left: -60, bottom: 0}}>
        <Tooltip />
        <YAxis
          domain={['auto', 'auto']}
          axisLine={true}
          tickLine={true}
          type='number'
        />
        <XAxis
          padding={{left: 20, right: 20}}
          dataKey='date'
          tickFormatter={formatXAxis}
        />
        <CartesianGrid stroke='#eee' horizontal={true} vertical={false} />
        <Line
          type='monotone'
          dot={false}
          strokeWidth={2}
          dataKey='value'
          stroke='#f44d50'
        />
        {/* <Legend verticalAlign = "bottom" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AssetChart;
