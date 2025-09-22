import React, { useState, useContext, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { FaUser, FaUserCheck, FaUserPlus } from 'react-icons/fa';
import EmptyState from './EmptyState';

const FollowView = () => {
  const {
    followers = [],
    following = [],
    getFollower,
    followUser,
    unfollowUser,
    userData,
  } = useUser();
  const [activeTab, setActiveTab] = useState('followers');
  const [loadingFollow, setLoadingFollow] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingFollow(true);
      setError(null);
      try {
        await getFollower();
      } catch (err) {
        console.error('Error fetching follow data:', err);
        setError('Failed to load follow data.');
      } finally {
        setLoadingFollow(false);
      }
    };
    fetchData();
  }, [getFollower]);

  const handleFollow = async (userId) => {
    setError(null);
    try {
      await followUser(userId);
    } catch (err) {
      console.error('Error following user:', err);
      setError('Failed to follow user.');
    }
  };

  const handleUnfollow = async (userId) => {
    setError(null);
    try {
      if (unfollowUser) {
        await unfollowUser(userId);
      } else {
        console.warn('unfollowUser method not implemented in context');
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      setError('Failed to unfollow user.');
    }
  };

  const UserListItem = ({
    user,
    action,
    actionLabel,
    actionClass,
    onActionClick,
  }) => (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
      <div className="flex items-center">
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <FaUser className="text-blue-500" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{`${user.firstname} ${user.lastname}`}</h3>
          <p className="text-sm text-gray-600">{user.headLine}</p>
        </div>
      </div>
      <button
        onClick={() => onActionClick(user._id)}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${actionClass}`}
        aria-label={`${actionLabel} ${user.username}`}
      >
        {actionLabel}
      </button>
    </div>
  );

  if (loadingFollow) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-1/3 rounded bg-gray-300"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-300"></div>
                  </div>
                  <div className="h-8 w-20 rounded bg-gray-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Connections</h1>
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'followers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('followers')}
            aria-selected={activeTab === 'followers'}
            role="tab"
          >
            <FaUser className="mr-2" />
            Followers{' '}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
              {followers.length}
            </span>
          </button>
          <button
            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'following' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('following')}
            aria-selected={activeTab === 'following'}
            role="tab"
          >
            <FaUserCheck className="mr-2" />
            Following{' '}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
              {following.length}
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-4 font-medium text-red-600" role="alert">
            {error}
          </div>
        )}
        {activeTab === 'followers' && (
          <div role="tabpanel" aria-labelledby="followers-tab">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              People following you
            </h2>
            {followers.length > 0 ? (
              <div className="space-y-4">
                {followers.map((follower) => (
                  <UserListItem
                    key={follower._id}
                    user={follower}
                    action="follow"
                    actionLabel="Follow Back"
                    actionClass="bg-blue-500 text-white hover:bg-blue-600"
                    onActionClick={handleFollow}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FaUser className="text-xl text-gray-400" />}
                title="No followers yet"
                description="When someone follows you, you'll see them here."
              />
            )}
          </div>
        )}
        {activeTab === 'following' && (
          <div role="tabpanel" aria-labelledby="following-tab">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              People you're following
            </h2>
            {following.length > 0 ? (
              <div className="space-y-4">
                {following.map((followedUser) => (
                  <UserListItem
                    key={followedUser._id}
                    user={followedUser}
                    action="unfollow"
                    actionLabel="Unfollow"
                    actionClass="bg-red-100 text-red-600 hover:bg-red-200"
                    onActionClick={handleUnfollow}
                  />
                ))}
              </div>
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

export default FollowView;
