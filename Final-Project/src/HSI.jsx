import './App.css';

import React from 'react';
import {Canvas} from '@react-three/fiber';
import HSI_Scene from "./HSI_Scene/HSI_Scene";

function HSI() {
  return (
    <div className="App">
      <React.Suspense fallback={<div>Getting data...</div>}>
        <Canvas id="canvas">
          <HSI_Scene />
        </Canvas>
      </React.Suspense>
    </div>
  );
}

export default HSI;