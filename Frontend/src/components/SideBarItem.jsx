import React from 'react'

const SideBarItem = ({ icon, text, count, isActive, onClick }) => {

    return (
        <div
            className={`flex items-center justify-between p-3 cursor-pointer rounded-lg hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-center">
                <span className="mr-3">{icon}</span>
                <span>{text}</span>
            </div>
            {count > 0 && <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{count}</span>}
        </div>
    );
}

export default SideBarItem