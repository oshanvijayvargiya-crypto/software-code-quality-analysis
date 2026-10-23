import React, { useEffect, useRef, useState } from 'react';
import { Tubes1Cursor } from 'threejs-components';
import { Activity } from 'lucide-react';

export default function TubesBackground() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cursorEffect = null;
    let isMounted = true;

    const initThree = async () => {
      try {
        if (!canvasRef.current) return;
        
        // Colors provided by user design system
        const cyan = "#00E5FF";
        const green = "#7CFF6B";
        const orange = "#FFB84D";
        const red = "#FF4D6D";

        cursorEffect = Tubes1Cursor(canvasRef.current, {
          tubes: {
            colors: [cyan, green, cyan],
            lights: {
              intensity: 200,
              colors: [cyan, green, orange, red] // subtle warning/critical highlights
            }
          }
        });
        
        if (isMounted) {
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Failed to initialize WebGL TubesCursor:", err);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    // Small delay to allow react layout to settle before initializing WebGL
    const timer = setTimeout(() => {
      initThree();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (cursorEffect && cursorEffect.destroy) {
        try {
          cursorEffect.destroy();
        } catch (e) {
          console.error("Error destroying cursor effect:", e);
        }
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-deep-void overflow-hidden">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-deep-void z-10 text-scanner-green">
          <Activity className="w-8 h-8 animate-pulse mb-4" />
          <span className="font-mono text-sm tracking-widest animate-pulse">INITIALIZING CODE SCANNER...</span>
        </div>
      )}
      
      {/* WebGL Canvas */}
      <canvas 
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Fallback pattern if WebGL fails */}
      {hasError && (
        <div className="absolute inset-0 bg-deep-void" style={{
          backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
          <div className="absolute inset-0 bg-gradient-to-b from-deep-void via-transparent to-deep-void"></div>
        </div>
      )}
    </div>
  );
}
