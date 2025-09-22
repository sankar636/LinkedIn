import React, { useEffect, useCallback, useMemo, useState } from 'react';
import ConnectionCard from './ConnectionCard';
import { FaUser, FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { useConnections } from '../context/ConnectionContext';
import { useUser } from '../context/UserContext';
import EmptyState from './EmptyState';

const ConnectionView = () => {
  const {
    sendConnectionRequest,
    fetchConnections,
    acceptConnection,
    connections,
    connectionRequests,
    ignoreConnection,
    ignoreRequests,
    outgoingRequests,
    loading,
    error,
  } = useConnections();
  const { getUserProfileById } = useUser();
  const [ignoredProfiles, setIgnoredProfiles] = useState([]);
  const [outGoingProfile, setOutGoingProfile] = useState([]);
  const [activeTab, setActiveTab] = useState('Invitations');

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    // Fetch ignored profiles
    const fetchIgnored = async () => {
      const profiles = [];
      for (const id of ignoreRequests) {
        try {
          const response = await getUserProfileById(id);
          // console.log("response",response);
          if (response) {
            profiles.push(response);
          }
        } catch (err) {
          console.error('Failed to fetch ignored profile:', err);
        }
      }
      setIgnoredProfiles(profiles);
    };
    if (ignoreRequests.length > 0) {
      fetchIgnored();
    }
  }, [ignoreRequests, getUserProfileById]);
  // console.log("Ignored Profiles",ignoredProfiles);

  // console.log("Outgoing Requests",outgoingRequests);

  useEffect(() => {
    // Fetch ignored profiles
    const fetchOutgoing = async () => {
      const profiles = [];
      for (const id of outgoingRequests) {
        try {
          const res = await getUserProfileById(id);
          // console.log("res", res);
          if (res) {
            profiles.push(res);
          }
        } catch (err) {
          console.error('Failed to fetch ignored profile:', err);
        }
      }
      setOutGoingProfile(profiles);
    };
    if (outgoingRequests.length > 0) {
      fetchOutgoing();
    }
  }, [outgoingRequests, getUserProfileById]);
  // console.log("Outgoing Profile",outGoingProfile);

  const handleSendRequest = async (userId) => {
    try {
      await sendConnectionRequest(userId);
    } catch (error) {
      console.log('Error sending Connection request ', error);
    }
  };
  const handleAccept = useCallback(
    async (requesterId) => {
      try {
        await acceptConnection(requesterId);
      } catch (err) {
        console.error('Failed to accept connection:', err);
      }
    },
    [acceptConnection],
  );
  const handleIgnore = useCallback(
    async (requesterId) => {
      try {
        await ignoreConnection(requesterId);
      } catch (error) {
        console.log('Failed to ignore connection:', error);
      }
    },
    [ignoreConnection],
  );

  // Group connections
  const invitations = connectionRequests.filter(
    (req) => !ignoreRequests.includes(req.id),
  );
  const ignored = connectionRequests.filter((req) =>
    ignoreRequests.includes(req.id),
  );
  // const pendings = outgoingRequests;
  const pending = outGoingProfile;
  // console.log("Pendings", pendings);
  // console.log("ignored", ignored);

  const accepted = connections;

  if (loading) {
    return <div className="p-4 text-center">Loading connections...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Connections</h1>

        <div className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 mb-6 flex overflow-x-auto border-b border-gray-200 md:w-full md:overflow-x-hidden">
          <button
            className={`flex min-w-[50%] items-center px-4 py-2 text-sm font-medium md:min-w-fit ${
              activeTab === 'Invitations'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Invitations')}
            aria-selected={activeTab === 'Invitations'}
            role="tab"
          >
            <FaUser className="mr-2" />
            Invitations{' '}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
              {invitations.length}
            </span>
          </button>

          <button
            className={`flex min-w-[50%] items-center px-4 py-2 text-sm font-medium md:min-w-fit ${
              activeTab === 'Connections'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Connections')}
            aria-selected={activeTab === 'Connections'}
            role="tab"
          >
            <FaUserCheck className="mr-2" />
            Your Connections{' '}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
              {accepted.length}
            </span>
          </button>

          <button
            className={`flex min-w-[50%] items-center px-4 py-2 text-sm font-medium md:min-w-fit ${
              activeTab === 'Pending'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Pending')}
            aria-selected={activeTab === 'Pending'}
            role="tab"
          >
            <FaUserCheck className="mr-2" />
            Pending{' '}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
              {pending.length}
            </span>
          </button>

          <button
            className={`flex min-w-[50%] items-center px-4 py-2 text-sm font-medium md:min-w-fit ${
              activeTab === 'Ignored'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('Ignored')}
            aria-selected={activeTab === 'Ignored'}
            role="tab"
          >
            <FaUserCheck className="mr-2" />
            Ignored{' '}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
              {ignored.length}
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-4 font-medium text-red-600" role="alert">
            {error}
          </div>
        )}

        {activeTab === 'Invitations' && (
          <div role="tabpanel" aria-labelledby="Invitations-tab">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              People following you
            </h2>
            {invitations.length > 0 ? (
              invitations.map((request) => (
                <ConnectionCard
                  key={request.id}
                  connection={request}
                  isRequest={true}
                  onAccept={handleAccept}
                  onIgnore={handleIgnore}
                  connectionStatus="pending"
                />
              ))
            ) : (
              <EmptyState
                icon={<FaUser className="text-xl text-gray-400" />}
                title="No Invitation yet"
                description="When someone follows you, you'll see them here."
              />
            )}
          </div>
        )}

        {activeTab === 'Connections' && (
          <div role="tabpanel" aria-labelledby="Connections-tab">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              People you're Connected
            </h2>
            {accepted.length > 0 ? (
              accepted.map((conn) => (
                <ConnectionCard
                  key={conn.id}
                  connection={conn}
                  isRequest={false}
                  connectionStatus="connected"
                  onConnect={handleSendRequest}
                />
              ))
            ) : (
              <EmptyState
                icon={<FaUserPlus className="text-xl text-gray-400" />}
                title="Not following anyone yet"
                description="When you follow someone, you'll see them here."
              />
            )}
          </div>
        )}
        {activeTab === 'Pending' && (
          <div role="tabpanel" aria-labelledby="Connections-tab">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              People you're Connected
            </h2>
            {pending.length > 0 ? (
              pending.map((request) => (
                <ConnectionCard
                  key={request._id}
                  connection={{
                    id: request._id,
                    name: `${request.firstname} ${request.lastname}`,
                    title: request.username,
                    profileImage: request.profileImage,
                  }}
                  isRequest={false}
                  connectionStatus="pending"
                  onConnect={handleSendRequest}
                />
              ))
            ) : (
              <EmptyState
                icon={<FaUserPlus className="text-xl text-gray-400" />}
                title="Not following anyone yet"
                description="When you follow someone, you'll see them here."
              />
            )}
          </div>
        )}
        {activeTab === 'Ignored' && (
          <div role="tabpanel" aria-labelledby="Ignored-tab">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              People you're Connected
            </h2>
            {ignored.length > 0 ? (
              ignored.map((request) => (
                <ConnectionCard
                  key={request.id}
                  connection={request}
                  isRequest={true}
                  onAccept={handleAccept}
                  onIgnore={handleIgnore}
                  connectionStatus="ignored"
                />
              ))
            ) : (
              <EmptyState
                icon={<FaUserPlus className="text-xl text-gray-400" />}
                title="Not following anyone yet"
                description="When you follow someone, you'll see them here."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionView;
