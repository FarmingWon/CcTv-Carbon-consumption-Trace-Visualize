import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ResponsiveChoropleth } from '@nivo/geo';
import { geoFeatures } from '../data/mockGeoFeatures';
import { tokens } from '../testtheme';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import MapProgressCircle from '../components/MapProgressCircle';

import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css'; // import css file from root.

const GlobalStyle = createGlobalStyle`
  .react-custom-alert__body {
    color: #000000 !important; // 메시지의 글씨 색상을 검정색으로 변경
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  animation: ${(props) => (props.fadeType === 'in' ? fadeIn : fadeOut)} 1s;
`;

const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [resources, setResources] = useState({
    CI: 0,
    carbon_emission: 0,
    clock: 0,
    cpu: 0,
    epoch: 0,
    gpu: 0,
    learning_time: 0,
    max_clock: 0,
    memory: 0,
    total_epoch: 0,
    total_gpu: 0,
    total_memory: 1
  });
  const [loading, setLoading] = useState(true);
  const [fadeType, setFadeType] = useState('in');
  const [isMigration, setIsMigration] = useState(false); // 마이그레이션 상태
  const [destRegion, setDestRegion] = useState(''); // 목적지 지역
  const [learningCountry, setCountry] = useState({
    dest_region: null,
    is_learning: true,
    migration: false,
    migration_progress: false,
    region: 'US-NE-ISNE',
    region_full: 'New England ISO'
  });

  const location = useLocation();

  const transformData = (result) => {
    return Object.keys(result).map((item) => {
      let countryId = '';
      switch (item) {
        case 'IE':
          countryId = 'IRL';
          break;
        case 'KR':
          countryId = 'KOR';
          break;
        case 'US-CAL-BANC':
          countryId = 'USA';
          break;
        default:
          countryId = item;
          break;
      }

      const color = ['USA', 'GBR', 'KOR'].includes(countryId) ? '#0000FF' : '#FF0000';
      return {
        id: countryId,
        value: result[item],
        color
      };
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/cur-carbon-intensity');
      const result = await response.json();

      const transformedData = transformData(result);
      console.log(transformedData);
      setData(transformedData);
      setFadeType('out');
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([
        { id: 'USA', value: 750000, color: '#FF0000' },
        { id: 'GBR', value: 500000, color: '#FF0000' },
        { id: 'KOR', value: 300000, color: '#FF0000' },
        ...geoFeatures.features.map((feature) => ({
          id: feature.properties.name,
          value: 400000,
          color: '#CCCCCC'
        }))
      ]);
      setFadeType('out');
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await fetch('/get_resource');
      const result = await response.json();
      setResources(result);
      console.log('Fetched resources:', result); // Updated logging
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const checkMigrationStatus = async () => {
    try {
      const response = await fetch('/is_train');
      const result = await response.json();
      switch (result.region) {
        case 'IT-CSO':
          result.region = 'IRL';
          break;
        case 'KR':
          result.region = 'KOR';
          break;
        case 'US-NE-ISNE':
          result.region = 'USA';
          break;
        default:
          result.region = 'USA';
          break;
      }
      setCountry(result);
      // console.log(learningCountry);
      setIsMigration(result.is_train);
      if (result.is_train) {
        setDestRegion(result.dest_region);
        toast.info(`Migration 됨. 도착지역은 ‘${result.dest_region}’ 입니다.`);
      }
    } catch (error) {
      console.error('Error fetching migration status:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData2, 5000);
    // 컴포넌트가 언마운트될 때 인터벌 제거
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(learningCountry);
    const interval = setInterval(checkMigrationStatus, 5000);
    // 컴포넌트가 언마운트될 때 인터벌 제거
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleReloadClick = async () => {
    setLoading(true);
    setFadeType('in');
    fetchData();
  };

  const handleStopClick = async () => {
    try {
      setLoading(true);
      setFadeType('in');
      const response = await fetch('/train-stop');
      if (response.ok) {
        setLoading(false);
      } else {
        throw new Error('Failed to stop training.');
      }
    } catch (error) {
      console.error('Error stopping training:', error);
      setLoading(false);
    }
  };

  // 마이그레이션 팝업 동작 여부 시뮬레이터 버튼
  const handleSimulateMigration = async () => {
    try {
      setIsMigration(true);
      setDestRegion('Test Region'); // 임시 목적지 지역 설정
      toast.info(`Migration 됨. 도착지역은 'Test Region’ 입니다.`);
    } catch (error) {
      console.error('Error simulating migration:', error);
    }
  };

  return (
    <>
      <GlobalStyle />
      {loading ? (
        <LoadingContainer fadeType={fadeType}>
          <CircularProgress />
          <Box ml={2}>
            <Typography variant="body1" fontSize="3rem">
              <FontAwesomeIcon icon="fa-solid fa-plane-departure" />
              Loading...🛫
            </Typography>
          </Box>
        </LoadingContainer>
      ) : (
        <ResponsiveChoropleth
          data={data}
          colors="YlGn"
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.grey[100]
                }
              },
              legend: {
                text: {
                  fill: colors.grey[100]
                }
              },
              ticks: {
                line: {
                  stroke: colors.grey[100],
                  strokeWidth: 1
                },
                text: {
                  fill: colors.grey[100]
                }
              }
            },
            legends: {
              text: {
                fill: colors.grey[100]
              }
            },
            tooltip: {
              container: {
                color: '#000000'
              }
            }
          }}
          features={geoFeatures.features}
          margin={{ top: 40, right: 0, bottom: 100, left: 0 }}
          domain={[0, 1000]}
          unknownColor="#141b2d"
          label="properties.name"
          valueFormat=".2s"
          projectionScale={isDashboard ? 40 : 200}
          projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
          projectionRotation={[0, 0, 0]}
          borderWidth={1.5}
          borderColor="#ffffff"
          fill={[
            {
              match: {
                id: learningCountry.region // 학습 중인 지역의 id와 일치
              },
              id: 'dots'
            }
          ]}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#000000',
              size: 4,
              padding: 1,
              stagger: true
            }
          ]}
          legends={
            !isDashboard
              ? [
                  {
                    anchor: 'bottom-left',
                    direction: 'column',
                    justify: true,
                    translateX: 20,
                    translateY: -100,
                    itemsSpacing: 0,
                    itemWidth: 94,
                    itemHeight: 18,
                    itemDirection: 'left-to-right',
                    itemTextColor: colors.grey[100],
                    itemOpacity: 0.85,
                    symbolSize: 18,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000000',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]
              : undefined
          }
        />
      )}
      <ToastContainer floatingTime={5000} />
      <div>
        {location.pathname === '/geography' && (
          <>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#1976d2', color: '#fff', marginRight: '30px' }}
                onClick={handleStopClick}
              >
                Stop Training
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#388e3c', color: '#fff' }}
                onClick={handleSimulateMigration}
              >
                Simulate Migration
              </Button>
            </Box>

            {/* 여기서부터 추가 컴포넌트 */}
            <div
              style={{
                display: 'flex',
                textAlign: 'left',
                marginTop: '30px',
                marginLeft: '30px',
                padding: '20px',
                borderRadius: '2px',
                backgroundColor: theme.palette.mode === 'dark' ? '#1F2A40' : '#F2F2F2',
                color: theme.palette.mode === 'dark' ? '#fff' : '#000'
              }}
            >
              <div style={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    fontSize: '1.25rem',
                    fontWeight: '800'
                  }}
                >
                  Data
                </Typography>
                <span
                  style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    fontSize: '1.25rem',
                    fontWeight: '900'
                  }}
                >
                  _______
                </span>
                <Typography variant="body1" style={{ marginTop: '30px', marginBottom: '10px' }}>
                  Region: <strong>{learningCountry.region_full}</strong>({learningCountry.region})
                </Typography>
                {isMigration && (
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    Arrival area: {destRegion}
                  </Typography>
                )}
              </div>

              <div
                style={{
                  width: '2px',
                  backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#ccc',
                  margin: '0 20px'
                }}
              ></div>

              <div style={{ flex: 2, display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontSize: '2rem' }}>
                    {resources.CI} gCO2eq
                  </Typography>
                  {/* 현재 탄소 밀집도 */}
                  <Typography variant="body1" style={{ fontSize: '13px' }}>
                    Current carbon density
                  </Typography>
                </div>

                <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontSize: '2rem' }}>
                    {parseFloat(resources.carbon_emission).toFixed(2)} gCO2eq/kWh
                  </Typography>
                  <Typography variant="body2" style={{ fontSize: '0.6rem', color: 'grey' }}>
                    {`(${
                      parseFloat(resources.carbon_emission) / 25
                    } 마리의 소가 트림을 한 양입니다..🐄🐃🐂)`}
                  </Typography>
                  {/* 누적 탄소 배출량 */}
                  <Typography variant="body1" style={{ fontSize: '13px' }}>
                    cumulative carbon emissions
                  </Typography>
                </div>

                <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontSize: '2rem' }}>
                    {parseFloat(resources.learning_time).toFixed(2)} second
                  </Typography>
                  {/* 누적 학습 시간 */}
                  <Typography variant="body1" style={{ fontSize: '13px' }}>
                    Cumulative learning time
                  </Typography>
                </div>

                <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontSize: '2rem' }}>
                    {parseFloat(resources.total_gpu).toFixed(2)} Wh
                  </Typography>
                  {/* 누적 전력 소비량 */}
                  <Typography variant="body1" style={{ fontSize: '13px' }}>
                    Cumulative power consumption
                  </Typography>
                </div>
              </div>
            </div>

            {/* 써클 차트 */}
            <div style={{ textAlign: 'left', marginTop: '10px', marginLeft: '30px' }}>
              <MapProgressCircle endpoint="/get_resource" locationName={learningCountry.region} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GeographyChart;
