import React, { useState } from 'react';
import axios from 'axios';

const TerminalComponent = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/execute', { command: input });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error occurred while executing command.');
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            backgroundColor: 'black', // 검은색 배경
            color: 'white', // 흰색 글씨
            width: '500px', // 가로 크기 조절
            height: '40px', // 세로 크기 조절
            textAlign: 'top' // 위에서부터 텍스트 정렬
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px'
          }}
        >
          Submit
        </button>
      </form>
      <div>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default TerminalComponent;

// 터미널 컴포넌트
