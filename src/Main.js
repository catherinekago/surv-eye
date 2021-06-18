import React, { useState, useEffect } from 'react';
import { WebGazeContext } from './WebGazeContext';
import RadioButton from './RadioButton';

const MainApp =  () => {
  const [state, setState] = useState("no state");
 

    return (
      <WebGazeContext.Consumer>
      {context => (
      <div style={{display: "flex"}}>

      <RadioButton id ="Button1"
      value="0"
      selected={"selected"}
      text="First Radio Button"
      onChange={() => console.log("hi")}/>
              <p>{"x is " + context.x + " and y is " + context.y}</p>
      </div>
      )}
      </WebGazeContext.Consumer>
    );
  }
  
  export default MainApp; 