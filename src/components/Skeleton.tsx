import React from 'react';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`glass-panel rounded-2xl p-4 animate-pulse bg-[var(--input-bg)] border border-[var(--stroke)] ${className}`}>
    <div className="h-4 bg-[var(--stroke)] rounded-md w-1/3 mb-3"></div>
    <div className="h-8 bg-[var(--stroke)] rounded-lg w-2/3 mb-2"></div>
    <div className="h-3 bg-[var(--stroke)] rounded-md w-1/2"></div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="glass-panel rounded-3xl p-6 border border-[var(--stroke)] animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 bg-[var(--stroke)] rounded-md w-48"></div>
      <div className="h-10 bg-[var(--stroke)] rounded-xl w-32"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 bg-[var(--input-bg)] rounded-xl border border-[var(--stroke)] flex items-center px-4">
          <div className="h-4 bg-[var(--stroke)] rounded w-full"></div>
        </div>
      ))}
    </div>
  </div>
);
