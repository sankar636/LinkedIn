import React from 'react'

const EmptyState = ({ icon, title, description }) => {
    return (
        <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    )
}

export default EmptyState