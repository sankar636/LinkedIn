import React, { useEffect, useMemo } from 'react';
import EmptyProfile from '/EmptyProfile.svg';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const ConnectionCard = ({
  connection,
  isRequest,
  onAccept,
  onIgnore,
  onConnect,
  connectionStatus,
}) => {
  const { getUserProfileById, userData } = useUser();
  useEffect(() => {
    if (connection && connection._id) {
      getUserProfileById(connection._id);
    }
  }, [connection, getUserProfileById]);

  const handleClick = () => {
    if (connection && connection._id) {
      getUserProfileById(connection._id);
    }
  };
  const isOwnPost = useMemo(
    () => userData?._id === connection._id,
    [userData?._id, connection._id],
  );

  const profileLink = useMemo(
    () => (isOwnPost ? '/profile' : `/profile/${connection.title}`),
    [isOwnPost, connection.title],
  );
  const renderButtons = () => {
    if (isRequest && connectionStatus === 'pending') {
      // Invitation: Accept & Ignore
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => onIgnore(connection.id)}
            className="rounded-full border border-gray-400 px-4 py-1 text-sm font-semibold hover:bg-gray-200"
          >
            Ignore
          </button>
          <button
            onClick={() => onAccept(connection.id)}
            className="rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Accept
          </button>
        </div>
      );
    }
    if (isRequest && connectionStatus === 'ignored') {
      // Ignored: show status only
      return (
        <div className="flex gap-2">
          <button
            disabled
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-semibold text-gray-500 hover:bg-gray-50"
          >
            Ignored
          </button>
          <button
            onClick={() => onAccept(connection.id)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Accept Again
          </button>
        </div>
      );
    }
    if (connectionStatus === 'connected') {
      // Connected: show status only
      return (
        <button
          className="cursor-not-allowed rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-600"
          disabled
        >
          Connected
        </button>
      );
    }
    if (connectionStatus === 'pending') {
      // Pending (outgoing): show status only
      return (
        <button
          className="cursor-not-allowed rounded-full bg-gray-200 px-4 py-1 text-sm font-semibold text-gray-500"
          disabled
        >
          Pending
        </button>
      );
    }
    // Default: show connect button
    return (
      <button
        className="rounded-full border border-gray-400 px-4 py-1 text-sm font-semibold text-blue-600 hover:bg-gray-100"
        onClick={() => onConnect(connection.id)}
      >
        Message
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 last:border-b-0 hover:bg-gray-50">
      <Link to={profileLink} className="flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          <img
            src={connection.profileImage || EmptyProfile}
            alt={connection.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{connection.name}</h3>
          <p className="text-sm text-gray-600">{connection.title || 'User'}</p>
        </div>
      </Link>
      {renderButtons()}
    </div>
  );
};

export default ConnectionCard;
