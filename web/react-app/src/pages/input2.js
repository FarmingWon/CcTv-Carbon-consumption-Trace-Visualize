import React, { useState } from 'react';

const Input2 = () => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    tel: ''
  });

  const onChange = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    // inputs[id] = value; 이런 형태는X. 상태관리가 되지 않는다.
    setInputs();
  };

  return (
    <div>
      <div>
        <label>이름</label>
        <input type="text" id="name" value={name} onChange={onChange}></input>
      </div>
      <div>
        <label>이메일</label>
        <input type="email" id="email" value={email} onChange={onChange}></input>
      </div>
      <div>
        <label>전화번호</label>
        <input type="tel" id="tel" value={tel} onChange={onChange}></input>
      </div>

      <br></br>
      <p>{txtValue}</p>
    </div>
  );
};

export default Counter;
