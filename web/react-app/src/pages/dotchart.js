import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: '1월', uv: 4000, pv: 2400, amt: 2400 },
  { name: '2월', uv: 3000, pv: 1398, amt: 2210 },
  { name: '3월', uv: 2000, pv: 9800, amt: 2290 },
  { name: '4월', uv: 2780, pv: 3908, amt: 2000 },
  { name: '5월', uv: 1890, pv: 4800, amt: 2181 },
  { name: '6월', uv: 2390, pv: 3800, amt: 2500 },
  { name: '7월', uv: 3490, pv: 4300, amt: 2100 }
];

const dotchart = () => {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  );
};

export default dotchart;
