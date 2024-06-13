import React, { useState } from 'react';

const Train = ({ endpoint, locationName }) => {
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
      <span className="resource-label">{locationName} terminal </span>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={'Please enter the command'}
          required
          className="terminal-input"
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            marginTop: '20px',
            backgroundColor: '#181830',
            color: 'white',
            fontFamily: 'Courier New, Courier, monospace',
            boxSizing: 'border-box',
            caretColor: 'white',
            textAlign: 'left',
            width: '100%',
            height: '8rem',
            maxWidth: '500px',
            resize: 'none',
            verticalAlign: 'top' // 텍스트를 왼쪽 위부터 정렬
          }}
        />
        <button type="submit" className="execute-btn" hidden>
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

export default Train;
