import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AssetChartProps {
  data: any[];
}


const AssetChart: React.FC<AssetChartProps> = ({data}) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data} margin={{top: 0, right: 0, left: -25, bottom: 0}}>
        <Tooltip />
        <YAxis axisLine={false} tickLine={false} />
        <XAxis dataKey='name' tickLine={false} axisLine={false} padding={{left: 20, right: 20}} />
        <CartesianGrid stroke='#eee' horizontal={true} vertical={false} />
        <Line type='monotone' dot={false} strokeWidth={2} dataKey='value' stroke='#f44d50' />
        {/* <Legend verticalAlign = "bottom" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AssetChart;
