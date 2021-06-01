import React from 'react';
import RadioButtonGroup from './RadioButtonGroup.js'
import './App.css';



const App = () => {



  return (
    <div className="App">
      <RadioButtonGroup 
      question= "What is your favorite animal?"
      left= "Dog"
      right= "Cat"/>
    </div>
  );
}

export default App;

