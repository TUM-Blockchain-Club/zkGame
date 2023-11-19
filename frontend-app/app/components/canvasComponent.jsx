"use client";

import React, { useRef, useEffect } from 'react';

function CanvasComponent() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Load the script
        const script = document.createElement('script');
        script.src = 'bundle.js';
        script.async = true;

        document.body.appendChild(script);

        // Optional: Any additional setup for the canvas can go here
        const canvas = canvasRef.current;
        // For example, setting the canvas size
        canvas.width = 800; // Set your desired width
        canvas.height = 600; // Set your desired height

        // Clean up
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            id="gameCanvas" 
            style={{ border: '5px solid #22C55E' , margin: 'auto'}} // Inline CSS for border
        ></canvas>
    );}

export default CanvasComponent;
