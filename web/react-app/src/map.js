import React, { useState } from 'react';
import worldMapImage from './worldmap.png'; // 이미지 임포트
import './map.css';

function WorldMap() {
  const [popupInfo, setPopupInfo] = useState(null);

  // 마우스를 가져다 대면 팝업 정보 설정
  const handleMouseOver = (info) => {
    setPopupInfo(info);
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
          style={{ top: '200px', left: '100px' }}
          onMouseOver={() => handleMouseOver('Point A 정보')}
          onMouseOut={handleMouseOut}
        ></div>
        <div
          className="dot"
          style={{ top: '300px', left: '300px' }}
          onMouseOver={() => handleMouseOver('Point B 정보')}
          onMouseOut={handleMouseOut}
        ></div>
        <div
          className="dot"
          style={{ top: '300px', left: '400px' }}
          onMouseOver={() => handleMouseOver('Point C 정보')}
          onMouseOut={handleMouseOut}
        ></div>
      </div>
      {/* 팝업 */}
      {popupInfo && <div className="popup">{popupInfo}</div>}
    </div>
  );
}

export default WorldMap;
