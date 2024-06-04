import React, { useState, useEffect } from 'react';

const List = () => {
  const [data, setData] = useState({ users: [] });

  useEffect(() => {
    fetch('/users') // URL을 /users로 변경
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>test 하는 중...</h1>
      <div>
        {data.users.length === 0 ? (
          <p>loading...</p>
        ) : (
          data.users.map((u, index) => <p key={index}>{u.name}</p>)
        )}
      </div>
    </div>
  );
};

export default List;
