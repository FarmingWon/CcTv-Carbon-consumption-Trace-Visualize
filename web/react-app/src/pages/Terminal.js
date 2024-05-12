import React, { useState } from 'react';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

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

        // const response = await fetch('http://localhost:5000/execute', { //로컬 환경! 이전코드
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ command: input })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOutput(data.output);
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
            backgroundColor: 'black',
            color: 'white',
            width: '500px',
            height: '40px',
            textAlign: 'top'
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

export default Terminal;
