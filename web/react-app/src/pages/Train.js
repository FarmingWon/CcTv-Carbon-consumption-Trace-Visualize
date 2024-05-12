import React, { useState, useEffect } from 'react';
import './Train.css';
import { PieChart, Pie, Cell } from 'recharts';

const ExecuteCommand = ({ endpoint, locationName }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 터미널 서버 연동 부분 (211 line 정도 보면 연동관련 내용 나와있습니다~!)
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
    <div className="re-te">
      <div className="terminal-container">
        <span className="resource-label">terminal ({locationName})</span>
        <p></p>
        <br></br>
        <div className="top-charts">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={'Please enter the command'}
              required
              style={{
                padding: '10px',
                fontSize: '16px',
                border: '2px solid #ccc',
                borderRadius: '4px',
                marginRight: '10px',
                backgroundColor: 'black',
                color: 'white',
                width: '300px',
                height: '100px',
                textAlign: 'left',
                fontFamily: 'monospace',
                caretColor: 'white',
                '::placeholder': {
                  color: '#999',
                  fontStyle: 'italic'
                }
              }}
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
      </div>
    </div>
  );
};

const Train = () => {
  const [resourceUS, setResourceUS] = useState({ cpu: 0, memory: 0, gpu: 0, epoch: 0 });
  const [resourceUK, setResourceUK] = useState({ cpu: 0, memory: 0, gpu: 0, epoch: 0 });
  const [resourceKR, setResourceKR] = useState({ cpu: 0, memory: 0, gpu: 0, epoch: 0 });

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

  // get_resourceUS이런식으로 요청했습니다!
  useEffect(() => {
    fetchData('/get_resourceUS', setResourceUS);
    fetchData('/get_resourceUK', setResourceUK);
    fetchData('/get_resourceKR', setResourceKR);
  }, []);

  const renderResourceTerminal = (resource, locationName) => {
    const data = [
      { name: 'CPU', value: resource.cpu },
      { name: 'Memory', value: resource.memory },
      { name: 'GPU', value: resource.gpu },
      { name: 'Epoch', value: resource.epoch }
    ];

    const colors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'];

    return (
      <div className="re-te">
        <div className="resource-container">
          <span className="resource-label">resources in use ({locationName})</span>
          <div className="top-charts">
            {data.slice(0, 2).map((entry, index) => (
              <div className="circular-progress" key={index}>
                <PieChart width={200} height={200}>
                  <Pie
                    data={[entry, { name: 'Empty', value: 100 - entry.value }]}
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
                </PieChart>
                <div className={`inner${index + 1}`}>
                  <span className="resource-name">{entry.name}</span>
                  <br />
                  <span className="resource-value">{entry.value}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bottom-charts">
            {data.slice(2).map((entry, index) => (
              <div className="circular-progress" key={index}>
                <PieChart width={200} height={200}>
                  <Pie
                    data={[entry, { name: 'Empty', value: 100 - entry.value }]}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="40%"
                    outerRadius="60%"
                    fill={[colors[index + 2], '#eee']}
                    dataKey="value"
                    labelLine={false}
                  >
                    <Cell key={`cell-${index}`} />
                    <Cell key={`cell-${index + 1}`} fill="#eee" />
                  </Pie>
                </PieChart>
                <div className={`inner${index + 3}`}>
                  <span className="resource-name">{entry.name}</span>
                  <br />
                  <span className="resource-value">{entry.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="info">
        <div className="label1">
          Cloud info :<p></p>
          <span className="cloudinfo">AWS(example)</span>
        </div>
        <div className="label2">
          Region :<p></p>
          <span className="region">UK(example)</span>
        </div>
        <div className="label3">
          Current carbon density :<p></p>
          <span className="carbon-density">example</span>
        </div>
      </div>

      <div className="resource-terminal">
        <div className="re-te">
          {renderResourceTerminal(resourceUS, 'US')}
          <ExecuteCommand endpoint="/sshUS" locationName="US" />
        </div>
        <div className="re-te">
          {renderResourceTerminal(resourceUK, 'UK')}
          <ExecuteCommand endpoint="/sshUK" locationName="UK" />
        </div>
        <div className="re-te">
          {renderResourceTerminal(resourceKR, 'KR')}
          <ExecuteCommand endpoint="/sshKR" locationName="KR" />
        </div>
      </div>
    </div>
  );
};

export default Train;
