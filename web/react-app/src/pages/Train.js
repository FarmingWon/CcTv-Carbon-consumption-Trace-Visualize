import React, { useState, useEffect } from 'react';
import './Train.css';

const Train = () => {
  const [resource, setResource] = useState({
    cpu: 0,
    memory: 0,
    total_memory: 0,
    gpu: 0,
    epoch: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/get_resource');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setResource(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>CcTv-Carbon-consumption-Trace-Visualize</h1>
      <p></p>
      <div>
        <div class="label1">클라우드 정보 : </div>
        <div class="label1">지역 : </div>
        <div class="label1">현재 탄소 밀집도 : </div>
      </div>
      <p></p>
      <div className="resource-container">
        {/* cpu사용량 */}
        <div className="circular-progress">
          <svg width="200" height="200">
            <circle className="background-circle" cx="100" cy="100" r="89" />
            <circle
              className="stroke"
              cx="100"
              cy="100"
              r="89"
              style={{
                strokeDasharray: `${2 * Math.PI * 89 * (resource.cpu / 100)} ${2 * Math.PI * 89}`
              }}
            />
          </svg>
          <div className="inner1">
            <span className="shame">CPU {resource.cpu}%</span>
          </div>
        </div>

        {/* total memory */}
        <div className="circular-progress">
          <svg width="200" height="200">
            <circle className="background-circle" cx="100" cy="100" r="89" />
            <circle
              className="stroke"
              cx="100"
              cy="100"
              r="89"
              style={{
                strokeDasharray: `${2 * Math.PI * 89 * (resource.memory / resource.total_memory)} ${
                  2 * Math.PI * 89
                }`
              }}
            />
          </svg>
          <div className="inner2">
            <span className="shame">MEMORY {resource.memory} MB</span>
          </div>
        </div>

        {/* gpu */}
        <div className="circular-progress">
          <svg width="200" height="200">
            <circle className="background-circle" cx="100" cy="100" r="89" />
            <circle
              className="stroke"
              cx="100"
              cy="100"
              r="89"
              style={{
                strokeDasharray: `${2 * Math.PI * 89 * (resource.gpu / 100)} ${2 * Math.PI * 89}`
              }}
            />
          </svg>
          <div className="inner3">
            <span className="shame">GPU {resource.gpu}%</span>
          </div>
        </div>

        {/* epoch */}
        <div className="circular-progress">
          <svg width="200" height="200">
            <circle className="background-circle" cx="100" cy="100" r="89" />
            <circle
              className="stroke"
              cx="100"
              cy="100"
              r="89"
              style={{
                strokeDasharray: `${2 * Math.PI * 89 * (resource.epoch / 100)} ${2 * Math.PI * 89}`
              }}
            />
          </svg>
          <div className="inner4">
            <span className="shame">EPOCH {resource.epoch}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Train;
