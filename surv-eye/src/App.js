import React, { useState } from 'react';

import './App.css';
import  RadioButton  from "./RadioButton.js";


const App = () => {

  const [selected, setSelected] = useState("0");

  return (
    <>
      <RadioButton
        value= "0"
        selected={selected}
        text="First Radio Button"
        onChange={() => setSelected("0")}
      />
      <RadioButton
        value= "1"
        selected={selected}
        text="Second Radio Button"
        onChange={() => setSelected("1")}
      />
    </>
  );
}

export default App;

