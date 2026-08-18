import React, { useEffect, useState } from 'react';

const AnimatedMascot = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calcoliamo la posizione relativa del mouse per muovere l'occhio
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Forma che fluttua/ruota */}
        <path 
          fill="var(--primary)" 
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,72.4,41.2C63.4,53.2,51.1,62.7,37.3,70.2C23.6,77.6,8.5,82.9,-6.2,84.7C-20.9,86.5,-35.3,84.8,-48.3,77.4C-61.4,70,-73.1,56.9,-81.4,41.6C-89.6,26.4,-94.4,9,-91.7,-7.1C-89.1,-23.3,-79,-38.3,-66.1,-49.6C-53.2,-60.9,-37.6,-68.5,-23.1,-73.4C-8.6,-78.3,4.7,-80.5,18.5,-79.8C32.2,-79.1,44.7,-76.4" 
          transform="translate(100 100)" 
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 100 100" 
            to="360 100 100" 
            dur="20s" 
            repeatCount="indefinite" 
          />
        </path>
        
        {/* Secondo blob più piccolo */}
        <path 
          fill="var(--accent)" 
          opacity="0.6"
          d="M39.9,-65.4C54,-54.1,69.5,-46.8,76.5,-33.6C83.5,-20.4,81.9,-1.2,74.5,14C67,29.2,53.6,40.3,40.1,50.7C26.5,61.1,13.2,70.8,-1.7,73.7C-16.6,76.6,-33.2,72.7,-46.5,62.8C-59.7,52.9,-69.5,37,-74.6,19.6C-79.7,2.2,-80.1,-16.8,-71.4,-30.9C-62.8,-45,-45,-54.2,-29.8,-64.1C-14.6,-74.1, -2,-84.9, 8.8,-83.4C19.7,-81.9, 25.8,-76.7, 39.9,-65.4Z" 
          transform="translate(100 100)" 
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="360 100 100" 
            to="0 100 100" 
            dur="25s" 
            repeatCount="indefinite" 
          />
        </path>

        {/* Occhio che segue il mouse */}
        <g transform={`translate(${100 + mousePos.x}, ${100 + mousePos.y})`}>
          <circle cx="0" cy="0" r="25" fill="var(--bg-dark)" />
          <circle cx={mousePos.x * 0.5} cy={mousePos.y * 0.5} r="10" fill="var(--text-main)" />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedMascot;
