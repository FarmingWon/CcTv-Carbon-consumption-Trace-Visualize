import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Intensity = () => {
  const data = [
    { name: 'US', intensity: 20, fill: '#8884d8' },
    { name: 'UK', intensity: 30, fill: '#82ca9d' },
    { name: 'KR', intensity: 40, fill: '#ffc658' }
  ];

  return (
    <div className="chart-box">
      <h2>Intensity Chart</h2>
      <BarChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="intensity" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Intensity;
