import React from 'react';

const SideBarItem = ({ icon, text, count, isActive, onClick }) => {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-gray-100 ${
        isActive ? 'bg-blue-50 font-semibold text-blue-700' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </div>
      {count > 0 && (
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
          {count}
        </span>
      )}
    </div>
  );
};

export default SideBarItem;
