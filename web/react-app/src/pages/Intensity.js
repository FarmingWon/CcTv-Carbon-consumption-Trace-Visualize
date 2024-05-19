import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Intensity = () => {
  const [data, setData] = useState([
    { name: 'US', intensity: 20 },
    { name: 'UK', intensity: 30 },
    { name: 'KR', intensity: 40 }
  ]);

  const colors = ['#ff0000', '#ffa500', '#0000ff']; // 빨간색, 주황색, 파란색

  // 서버에서 탄소 집약도 데이터를 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/carbon-intensity');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        const formattedData = [
          { name: 'US', intensity: json.california },
          { name: 'UK', intensity: json.uk },
          { name: 'KR', intensity: json.korea }
        ];
        // 데이터 정렬 및 색상 할당
        const sortedData = formattedData
          .sort((a, b) => b.intensity - a.intensity)
          .map((item, index) => ({
            ...item,
            fill: colors[index]
          }));
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching carbon intensity data:', error);
        // 데이터 정렬 및 색상 할당 (더미 데이터)
        const sortedData = data
          .sort((a, b) => b.intensity - a.intensity)
          .map((item, index) => ({
            ...item,
            fill: colors[index]
          }));
        setData(sortedData);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-box">
      <h2>Intensity Chart</h2>
      <BarChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="intensity" />
      </BarChart>
    </div>
  );
};

export default Intensity;
