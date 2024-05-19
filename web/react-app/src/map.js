import React, { useState, useEffect } from 'react';
import worldMapImage from './worldmap.png'; // 이미지 임포트
import './map.css';

function WorldMap() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [carbonData, setCarbonData] = useState({});

  // 서버에서 탄소 집약도 데이터를 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/carbon-intensity');
        const data = await response.json();
        setCarbonData(data);
      } catch (error) {
        console.error('Error fetching carbon intensity data:', error);
      }
    };

    fetchData();
  }, []);

  // 마우스를 가져다 대면 팝업 정보 설정 및 위치 설정
  const handleMouseOver = (info, x, y) => {
    setPopupInfo(info);
    setPopupPosition({ x, y });
  };

  // 마우스를 떼면 팝업 정보 제거
  const handleMouseOut = () => {
    setPopupInfo(null);
  };

  return (
    <div className="map-box">
      <div className="map-header">Carbon Intensity Map</div>

      <div className="world-map-container">
        <img src={worldMapImage} alt="World Map" className="world-map" />
        {/* 점들을 표시하고 마우스 이벤트를 추가 */}
        <div
          className="dot"
          style={{ top: '240px', left: '130px' }}
          onMouseOver={() =>
            handleMouseOver(`Point A 정보 (미국 캘리포니아): ${carbonData.california}`, 130, 252)
          }
          onMouseOut={handleMouseOut}
        ></div>
        <div
          className="dot"
          style={{ top: '190px', left: '320px' }}
          onMouseOver={() => handleMouseOver(`Point B 정보 (영국): ${carbonData.uk}`, 463, 185)}
          onMouseOut={handleMouseOut}
        ></div>
        <div
          className="dot"
          style={{ top: '237px', left: '545px' }}
          onMouseOver={() => handleMouseOver(`Point C 정보 (한국): ${carbonData.korea}`, 822, 250)}
          onMouseOut={handleMouseOut}
        ></div>
      </div>
      {/* 팝업 */}
      <div
        className={`popup ${popupInfo ? 'show' : ''}`}
        style={{ top: popupPosition.y + 20, left: popupPosition.x + 20 }}
      >
        {popupInfo}
      </div>
    </div>
  );
}

export default WorldMap;
