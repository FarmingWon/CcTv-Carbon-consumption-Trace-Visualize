import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Counter from './pages/Counter';
import Input from './pages/Input';
// import Terminal from './pages/Terminal';
import List from './pages/List';
import ExecuteCommand from './pages/h_execute';
import Train from './pages/Train';
// import Train2 from './pages/train2';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
          <Link to="/Counter">Counter</Link> | <Link to="/Input">Input</Link> |{' '}
          <Link to="/List">List</Link> | <Link to="/ExecuteCommand">H-execute</Link>|{' '}
          <Link to="/Train">Train</Link> |
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/Counter" component={Counter} />
          <Route path="/Input" component={Input} />
          <Route path="/List" component={List} />
          <Route path="/ExecuteCommand" component={ExecuteCommand} />
          <Route path="/Train" component={Train} />\
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// // 연동확인코드
// import React, { useState, useEffect } from 'react';

// function App() {
//   // state
//   const [data, setData] = useState({ users: [] });

//   useEffect(() => {
//     fetch('/users')
//       .then((response) => response.json())
//       .then((data) => {
//         // 받아온 데이터를 data 변수에 update
//         setData(data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div className="App">
//       <h1>test 하는 중...</h1>
//       <div>
//         {/* 삼항연산자 */}
//         {data.users.length === 0 ? (
//           // fetch가 완료되지 않았을 경우에 대한 처리
//           <p>loading...</p>
//         ) : (
//           data.users.map((u, index) => <p key={index}>{u.name}</p>)
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
