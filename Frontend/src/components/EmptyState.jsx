import React from 'react';

const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
