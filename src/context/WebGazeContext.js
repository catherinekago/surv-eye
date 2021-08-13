import React from 'react';

export const WebGazeInfo = {
  x: 0,
  y: 0,
  time: 0
};

export const WebGazeContext = React.createContext(
  WebGazeInfo
);
