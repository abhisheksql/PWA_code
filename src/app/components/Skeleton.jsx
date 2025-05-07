// src/components/Skeleton.jsx

import React from 'react';
import '../../../public/style/Skeleton.css';

const Skeleton = ({ width, height, borderRadius = '4px' }) => {
  return (
    <div
      className="skeleton shimmer"
      style={{
        width: width || '100%',
        height: height || '16px',
        margin: '2px',
        borderRadius,
      }}
    />
  );
};

export default Skeleton;
