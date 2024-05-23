import React, { useState, useEffect } from 'react';
import './Train.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const ExecuteCommand = ({ endpoint, locationName }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: input })
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다');
      }

      const data = await response.json();
      setOutput(data.output);
      setError('');
    } catch (err) {
      console.error('에러:', err);
      setOutput('');
      setError('명령을 실행하는 동안 오류가 발생했습니다.');
    }
  };

  return (
    <div className="terminal-container">
      <span className="resource-label">terminal ({locationName})</span>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={'Please enter the command'}
          required
          className="terminal-input"
        />
        <button type="submit" className="execute-btn">
          Execute
        </button>
      </form>
      {output && (
        <div>
          <h2>Output:</h2>
          <pre>{output}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

const Train = () => {
  const [resourceUS, setResourceUS] = useState({
    cpu: {
      used: 50,
      total: 100
    },
    gpu: {
      used: 60,
      total: 120
    },
    memory: {
      used: 70,
      total: 100
    },
    cpu_info: 'Intel Core i7~~',
    gpu_info: 'NVIDIA GeForce RTX 3080~~',
    CI: 0.8,
    epoch: 1,
    clock: 2,
    max_clock: 3,
    learning_time: '',
    carbon_emission: ''
  });
  const [resourceUK, setResourceUK] = useState({
    cpu: {
      used: 40,
      total: 100
    },
    gpu: {
      used: 70,
      total: 120
    },
    memory: {
      used: 80,
      total: 100
    },
    cpu_info: 'AMD Ryzen 9~~',
    gpu_info: 'NVIDIA GeForce GTX 2080~~',
    CI: 0.6,
    epoch: 0,
    clock: 2,
    max_clock: 3,
    learning_time: '',
    carbon_emission: ''
  });
  const [resourceKR, setResourceKR] = useState({
    cpu: {
      used: 30,
      total: 100
    },
    gpu: {
      used: 50,
      total: 120
    },
    memory: {
      used: 60,
      total: 100
    },
    cpu_info: 'Intel Core i9~~',
    gpu_info: 'AMD Radeon RX 6800~~~',
    CI: 0.7,
    epoch: 1,
    clock: 2,
    max_clock: 4,
    learning_time: '',
    carbon_emission: ''
  });

  // Dummy data for com-info
  const dummyData = {
    cpu: {
      used: 70,
      total: 100
    },
    gpu: {
      used: 80,
      total: 120
    },
    memory: {
      used: 90,
      total: 100
    },
    cpu_info: 'Intel Core i7~~',
    gpu_info: 'NVIDIA GeForce RTX 3080~~',
    epoch: 100,
    clock: 2000,
    max_clock: 2500,
    learning_time: '2 hours',
    carbon_emission: '100 kg',
    CI: 0.85
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data from server
    fetchData('/get_resourceUS', setResourceUS);
    fetchData('/get_resourceUK', setResourceUK);
    fetchData('/get_resourceKR', setResourceKR);
  }, []);

  const renderResourceTerminal = (resource, locationName) => {
    const comInfoData = [
      { label: 'CPU Used', value: resource.cpu.used },
      { label: 'Memory Used', value: resource.memory.used },
      { label: 'GPU Used', value: resource.gpu.used },
      { label: 'Epoch', value: resource.epoch },
      { label: 'Clock', value: resource.clock },
      { label: 'Max Clock', value: resource.max_clock },
      { label: 'Learning Time', value: resource.learning_time },
      { label: 'Carbon Emission', value: resource.carbon_emission },
      { label: 'CI', value: resource.CI }
    ];

    const topData = [
      { name: 'CPU', value: resource.cpu.used / resource.cpu.total },
      { name: 'GPU', value: resource.gpu.used / resource.gpu.total },
      { name: 'Memory', value: resource.memory.used / resource.memory.total }
    ];

    const colors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000', '#00FFFF'];

    return (
      <div className="resource-terminal">
        <div className="resource-container">
          <span className="resource-label">resources in use ({locationName})</span>

          <div className="com-info">
            {comInfoData.map((data, index) => (
              <p key={index}>
                {data.label}: {data.value}
              </p>
            ))}
          </div>

          <div className="top-chart">
            <div className="top-text">
              {topData.map((entry, index) => (
                <div className="circular-progress" key={index}>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={[
                        { name: entry.name, value: entry.value },
                        { name: 'Empty', value: 1 - entry.value }
                      ]}
                      cx="50%"
                      cy="50%"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius="40%"
                      outerRadius="60%"
                      fill={[colors[index], '#eee']}
                      dataKey="value"
                      labelLine={false}
                    >
                      <Cell key={`cell-${index}`} />
                      <Cell key={`cell-${index + 1}`} fill="#eee" />
                    </Pie>
                    <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                  </PieChart>
                  <div className="inner">
                    <span
                      className="resource-name"
                      style={{ marginLeft: index === 0 ? '34px' : index === 1 ? '35px' : '23px' }}
                    >
                      {entry.name}
                    </span>
                    <br />
                    <span
                      className="resource-value"
                      style={{ marginLeft: index === 0 ? '34px' : index === 1 ? '35px' : '23px' }}
                    >
                      {(entry.value * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ExecuteCommand endpoint={`/ssh${locationName}`} locationName={locationName} />
      </div>
    );
  };

  return (
    <div className="container">
      <div className="resource-terminal-wrapper">
        {renderResourceTerminal(resourceUS, 'US')}
        {renderResourceTerminal(resourceUK, 'UK')}
        {renderResourceTerminal(resourceKR, 'KR')}
        {/* Render a dummy terminal with dummy data */}
        {/* {renderResourceTerminal(dummyData, 'Dummy')} */}
      </div>
    </div>
  );
};

export default Train;
