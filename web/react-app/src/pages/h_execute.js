// import React, { useState } from 'react';

// const ExecuteCommand = () => {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('/execute', {
//         // execute로 서버 요청
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ command: input })
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       setOutput(data.output);
//       setError('');
//     } catch (err) {
//       console.error('Error:', err);
//       setOutput('');
//       setError('Error occurred while executing command.');
//     }
//   };

//   return (
//     <div>
//       <h1>Execute Command - (hello.py 실행여부 체크 서버)</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={input}
//           onChange={handleInputChange}
//           placeholder="xterm대신 쓰고있는 input형태의 터미널입니다.."
//           required
//           style={{
//             padding: '10px',
//             fontSize: '16px',
//             border: '2px solid #ccc',
//             borderRadius: '4px',
//             marginRight: '10px',
//             backgroundColor: 'black',
//             color: 'white',
//             width: '500px',
//             height: '40px',
//             textAlign: 'left', // 텍스트를 왼쪽 정렬로 변경
//             fontFamily: 'monospace', // monospace 글꼴 적용
//             caretColor: 'white' // 커서 색상을 흰색으로 설정
//           }}
//         />
//         <button type="submit">Execute</button>
//       </form>
//       {output && (
//         <div>
//           <h2>Output:</h2>
//           <pre>{output}</pre>
//         </div>
//       )}
//       {error && (
//         <div>
//           <h2>Error:</h2>
//           <pre>{error}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExecuteCommand;
