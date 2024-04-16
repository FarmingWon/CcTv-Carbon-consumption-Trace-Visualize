// 딥러닝 파일 train시키고 시각화하는 컴포넌트

import React, { useState, useEffect } from 'react';

const Train = () => {
  const [resource, setResource] = useState({
    cpu: 0,
    memory: 0,
    total_memory: 0,
    gpu: 0,
    epoch: 0
  });
  const [inputCommand, setInputCommand] = useState('');

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

    const intervalId = setInterval(fetchData, 1000); // 1초마다 데이터 받아옴!

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    setInputCommand(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/train', {
        method: 'GET'
      });

      if (!response.ok) {
        // 응답오류시
        throw new Error('Network response was not ok');
      }

      //데이터 트레이닝
      const data = await response.json();
      if (data.train) {
        console.log('Training started');
      }
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  return (
    <div>
      <h1>Main 화면입니다</h1>
      <div>
        <p>CPU 사용량: {resource.cpu}</p>
        <p>메모리 사용량: {resource.memory} MB</p>
        <p>전체 메모리: {resource.total_memory} MB</p>
        <p>GPU 사용량: {resource.gpu}</p>
        <p>Epoch: {resource.epoch}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputCommand}
          onChange={handleInputChange}
          placeholder="명령어를 입력하세요 (예: python train.py)"
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            backgroundColor: 'black',
            color: 'white',
            width: '500px',
            height: '40px'
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
          실행
        </button>
      </form>
    </div>
  );
};

export default Train;
