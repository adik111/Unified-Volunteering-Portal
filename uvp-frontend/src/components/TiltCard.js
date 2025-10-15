"use client";
import React, { useState } from 'react';

const TiltCard = ({ 
  image, 
  title,
  onClick, 
  className = "", 
  threshold = 12,
  children 
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div 
      className={`rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer bg-white ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onClick}
      style={{ 
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
      }}
    >
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-52 object-cover" 
        />
      )}
      <div className="p-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {title}
          </h3>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
