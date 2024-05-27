import React, { useState, useEffect } from 'react';
import { WorldMap } from 'react-svg-worldmap';
import './map.css';

function WorldMapComponent() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [carbonData, setCarbonData] = useState({});

  // 서버에서 탄소 집약도 데이터 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/carbon-intensity');
        const data = await response.json();
        console.log('Fetched carbon intensity data:', data); // 데이터를 콘솔에 출력하여 확인
        setCarbonData(data);
      } catch (error) {
        console.error('Error fetching carbon intensity data:', error);
      }
    };

    fetchData();
  }, []);

  // 지도 데이터 생성 (지금은 임시데이터 40 20 5 넣어놨음)
  const mapData = [
    { country: 'US', value: carbonData.US || 40 },
    { country: 'GB', value: carbonData.GB || 20 },
    { country: 'KR', value: carbonData.KR || 5 }
  ];

  return (
    <div className="map-box">
      <div className="map-header">Carbon Intensity Map</div>
      <div className="world-map-container">
        <WorldMap color="green" size="responsive" data={mapData} />
      </div>
      <div className="carbon-data-list">
        밑의 수치가 40, 20, 5로 뜨면 프론트 임시데이터임
        {mapData.map((countryData) => (
          <div key={countryData.country} className="country-data">
            {countryData.country}: {countryData.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldMapComponent;

// {
//   "carbonData": {
//     "US": 40,
//     "GB": 20,
//     "KR": 5
//   },
//   "highlightedCountry": "US"
// }
