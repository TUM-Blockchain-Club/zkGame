"use client";

import React, { useEffect, useRef } from 'react';
import { Game } from './logic/Game';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const game = new Game(canvasRef.current);
      game.run(() => {
        
      });
      
      // Optional: Cleanup function
      return () => game.stop(); // TODO: implement this stop method
    }
  }, []);

  return <canvas ref={canvasRef} id="gameCanvas" style={{ border: '5px solid #22C55E' , margin: 'auto'}} />;
};

export default GameCanvas;
