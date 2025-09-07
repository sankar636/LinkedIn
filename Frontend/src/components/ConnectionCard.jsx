import React from 'react';
import EmptyProfile from "/EmptyProfile.svg"; 

const ConnectionCard = ({ connection, isRequest, onAccept, onIgnore, onConnect, connectionStatus }) => {

    const renderButtons = () => {
        if (isRequest && connectionStatus === "pending") {
            // Invitation: Accept & Ignore
            return (
                <div className="flex space-x-2">
                    <button 
                        onClick={() => onIgnore(connection.id)}
                        className="px-4 py-1 border border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-200"
                    >
                        Ignore
                    </button>
                    <button 
                        onClick={() => onAccept(connection.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600"
                    >
                        Accept
                    </button>
                </div>
            );
        }
        if (isRequest && connectionStatus === "ignored") {
            // Ignored: show status only
            return (
                <div className='flex gap-2'>
                    <button disabled className="py-2 px-4 border rounded-full text-gray-500 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer">Ignored</button>
                    <button onClick={() => onAccept(connection.id)} className="py-2 px-4 border rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 cursor-pointer">Accept Again</button>
                </div>
            );
        }
        if (connectionStatus === "connected") {
            // Connected: show status only
            return (
                <button className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold cursor-not-allowed" disabled>
                    Connected
                </button>
            );
        }
        if (connectionStatus === "pending") {
            // Pending (outgoing): show status only
            return (
                <button className="px-4 py-1 bg-gray-200 text-gray-500 rounded-full text-sm font-semibold cursor-not-allowed" disabled>
                    Pending
                </button>
            );
        }
        // Default: show connect button
        return (
            <button 
                className="px-4 py-1 border border-gray-400 rounded-full text-sm font-semibold text-blue-600 hover:bg-gray-100"
                onClick={() => onConnect(connection.id)}
            >
                Message
            </button>
        );
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                    <img 
                        src={connection.profileImage || EmptyProfile} 
                        alt={connection.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{connection.name}</h3>
                    <p className="text-sm text-gray-600">{connection.title || 'User'}</p>
                </div>
            </div>
            {renderButtons()}
        </div>
    );
};

export default ConnectionCard;