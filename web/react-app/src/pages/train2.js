// import React, { useState, useEffect } from 'react';
// import { Doughnut } from 'react-chartjs-2';

// const Train2 = () => {
//   // 더미 데이터
//   const [resource, setResource] = useState({
//     cpu: 60,
//     memory: 8000,
//     total_memory: 16000,
//     gpu: 2,
//     epoch: 10
//   });

//   // 서버로부터 데이터를 가져오는 대신 더미 데이터를 사용하겠습니다.
//   useEffect(() => {
//     const fetchData = async () => {
//       // 서버 연결 대신 더미 데이터를 사용합니다.
//       // 실제 서버 연결 시에는 이 부분을 주석 처리하고 서버로부터 데이터를 가져오는 로직을 사용하세요.
//       setResource({
//         cpu: Math.random() * 100,
//         memory: 8000 + Math.random() * 2000,
//         total_memory: 16000,
//         gpu: Math.floor(Math.random() * 8),
//         epoch: Math.floor(Math.random() * 50)
//       });
//     };

//     fetchData();

//     const intervalId = setInterval(fetchData, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const cpuData = {
//     labels: ['Used', 'Unused'],
//     datasets: [
//       {
//         data: [resource.cpu, 100 - resource.cpu],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB']
//       }
//     ]
//   };

//   return (
//     <div>
//       <h1>Main 화면입니다</h1>
//       <div>
//         <Doughnut data={cpuData} />
//         <p>메모리 사용량: {resource.memory.toFixed(2)} MB</p>
//         <p>전체 메모리: {resource.total_memory} MB</p>
//         <p>GPU 사용량: {resource.gpu}</p>
//         <p>Epoch: {resource.epoch}</p>
//       </div>
//     </div>
//   );
// };

// export default Train2;
