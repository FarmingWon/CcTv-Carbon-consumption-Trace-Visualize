import React, { useState, useEffect } from 'react';
import './Train.css';
import { PieChart, Pie, Cell } from 'recharts';

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
    <div className="terminal-container">
      <div className="terminal-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={'Please enter the command you want! This is real terminal'}
            required
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px',
              backgroundColor: 'black',
              color: 'white',
              width: '700px',
              height: '300px',
              textAlign: 'left',
              fontFamily: 'monospace',
              caretColor: 'white',
              // Placeholder 스타일
              '::placeholder': {
                color: '#999', // Placeholder 텍스트 색상 변경
                fontStyle: 'italic' // 이탤릭체로 변경
              }
            }}
          />

          {/* ssh선택 부분 */}
          <select>
            <option value="US">US</option>
            <option value="UK">UK</option>
            <option value="KR">KR</option>
          </select>

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
  );
};

const Train = () => {
  const [resource, setResource] = useState({
    cpu: 30,
    memory: 0,
    gpu: 0,
    epoch: 0
  });

  const [output, setOutput] = useState('');

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

  useEffect(() => {
    fetchData();
  }, []);

  const data = [
    { name: 'CPU', value: resource.cpu },
    { name: 'Memory', value: resource.memory },
    { name: 'GPU', value: resource.gpu },
    { name: 'Epoch', value: resource.epoch }
  ];

  const colors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'];

  return (
    <div className="container">
      <div className="info">
        {/* 클라우드정보 */}
        <div className="label1">
          Cloud info
          <p></p>
          <span className="cloudinfo">AWS(example)</span>
        </div>
        {/* 지역 */}
        <div className="label2">
          Region
          <p></p>
          <span className="region">UK(example)</span>
        </div>
        {/* 현재 탄소 밀집도 */}
        <div className="label3">
          Current carbon density
          <p></p>
          <span className="carbon-density">example</span>
        </div>
      </div>

      <div className="resource-terminal">
        <div className="resource-container">
          <span className="resource-label">resources in use</span>
          {/* 위 차트 시작 */}
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
                    innerRadius="50%"
                    outerRadius="70%"
                    fill={[colors[index], '#eee']} // 변경된 부분
                    dataKey="value"
                    labelLine={false}
                  >
                    <Cell key={`cell-${index}`} />
                    <Cell key={`cell-${index + 1}`} fill="#eee" />
                  </Pie>
                </PieChart>
                <div className={`inner${index + 1}`}>
                  <span className="resource-name">{entry.name}</span> {/* 리소스 이름 */}
                  <br /> {/* 개행 */}
                  <span className="resource-value">{entry.value}%</span> {/* 리소스 수치 */}
                </div>
              </div>
            ))}
          </div>
          {/* 아래 차트 시작 */}
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
                    innerRadius="50%"
                    outerRadius="70%"
                    fill={[colors[index + 2], '#eee']} // 변경된 부분
                    dataKey="value"
                    labelLine={false}
                  >
                    <Cell key={`cell-${index}`} />
                    <Cell key={`cell-${index + 1}`} fill="#eee" />
                  </Pie>
                </PieChart>
                <div className={`inner${index + 3}`}>
                  <span className="resource-name">{entry.name}</span> {/* 리소스 이름 */}
                  <br /> {/* 개행 */}
                  <span className="resource-value">{entry.value}%</span> {/* 리소스 수치 */}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 결과 출력 */}
        <div className="output">
          <pre>{output}</pre>
        </div>
        {/* ExecuteCommand 터미널 컴포넌트 추가 */}
        <ExecuteCommand />
      </div>
    </div>
  );
};

export default Train;
