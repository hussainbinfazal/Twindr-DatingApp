import React from 'react';

const Badge = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
      {count > 99 ? '99+' : count}
    </div>
  );
};

export default Badge;