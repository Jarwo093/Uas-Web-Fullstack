import React from 'react';

export const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton skeleton-text"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ count = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton skeleton-card" />
    ))}
  </div>
);

export const SkeletonRow = ({ count = 3, className = '' }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton skeleton-row" />
    ))}
  </div>
);

export const SkeletonStat = ({ count = 4 }) => (
  <div className="grid-stats">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton skeleton-stat" />
    ))}
  </div>
);
