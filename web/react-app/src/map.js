import React, { useState } from 'react';

function MoveDot() {
  const [dotLeft, setDotLeft] = useState(0); // 점의 가로 위치 상태
  const [targetPosition, setTargetPosition] = useState(150); // 이동할 특정 위치 상태

  // 버튼 클릭 시 특정 위치로 점을 이동하는 함수
  const moveToTargetPosition = () => {
    setDotLeft(targetPosition); // 특정 위치로 점의 가로 위치 변경
  };

  // 특정 위치 입력 폼 변경 시 상태 업데이트
  const handleInputChange = (event) => {
    setTargetPosition(parseInt(event.target.value));
  };

  return (
    <div>
      <div
        id="container"
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          backgroundColor: '#ddd',
          margin: '50px auto'
        }}
      >
        <div
          id="dot"
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'red',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: `${dotLeft}px`, // 점의 가로 위치를 상태에 맞게 동적으로 설정
            transition: 'left 2s linear' // 점의 이동에 대한 애니메이션 효과
          }}
        ></div>
        <input
          type="number"
          value={targetPosition}
          onChange={handleInputChange}
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
        <button
          onClick={moveToTargetPosition}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          특정 위치로 이동하기
        </button>
      </div>
    </div>
  );
}

export default MoveDot;
