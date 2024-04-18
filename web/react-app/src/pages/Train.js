import React, { useState, useEffect } from 'react';
import './Train.css';

const ExecuteCommand = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: input })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOutput(data.output);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setOutput('');
      setError('Error occurred while executing command.');
    }
  };

  // 터미널 컴포넌트 jsx 시작
  return (
    <div className="terminal-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Terminal"
          required
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            backgroundColor: 'black',
            color: 'white',
            width: '500px',
            height: '80px',
            textAlign: 'left',
            fontFamily: 'monospace',
            caretColor: 'white'
          }}
        />
        <button type="submit" style={{ display: 'none' }}>
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
  const [resource, setResource] = useState({
    cpu: 0,
    memory: 0,
    total_memory: 0,
    gpu: 0,
    epoch: 0
  });

  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');

  const startTraining = async () => {
    try {
      const response = await fetch('/train', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.train) {
        console.log('Training started successfully');
      }
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: inputText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

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
      <div className="head">
        <img src="./logo.png" alt="Logo" width="100px" height="auto"></img>
        <h1>CcTv-Carbon-consumption-Trace-Visualize</h1>
      </div>
      <p></p>
      <div className="info">
        {/* 클라우드정보 */}
        <div className="label1">Cloud info : </div>
        {/* 지역 */}
        <div className="label1">Region : </div>
        {/* 현재 탄소 밀집도 */}
        <div className="label1">Current carbon density : </div>
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

      {/* 결과 출력 */}
      <div className="output">
        <pre>{output}</pre>
      </div>

      {/* ExecuteCommand 터미널 컴포넌트 추가 */}
      <ExecuteCommand />
    </div>
  );
};

export default Train;
