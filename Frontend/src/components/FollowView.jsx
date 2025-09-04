import React, { useState, useContext, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { FaUser, FaUserCheck, FaUserPlus } from 'react-icons/fa';

const FollowView = () => {
  const { followers = [], following = [], getFollower, followUser, unfollowUser, userData } = useUser();
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
        console.error("Error fetching follow data:", err);
        setError("Failed to load follow data.");
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
      console.error("Error following user:", err);
      setError("Failed to follow user.");
    }
  };

  const handleUnfollow = async (userId) => {
    setError(null);
    try {
      if (unfollowUser) {
        await unfollowUser(userId);
      } else {
        console.warn("unfollowUser method not implemented in context");
      }
    } catch (err) {
      console.error("Error unfollowing user:", err);
      setError("Failed to unfollow user.");
    }
  };

  const UserListItem = ({ user, action, actionLabel, actionClass, onActionClick }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
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
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${actionClass}`}
        aria-label={`${actionLabel} ${user.username}`}
      >
        {actionLabel}
      </button>
    </div>
  );

  if (loadingFollow) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Connections</h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'followers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('followers')}
            aria-selected={activeTab === 'followers'}
            role="tab"
          >
            <FaUser className="mr-2" />
            Followers <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{followers.length}</span>
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('following')}
            aria-selected={activeTab === 'following'}
            role="tab"
          >
            <FaUserCheck className="mr-2" />
            Following <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{following.length}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 font-medium" role="alert">
            {error}
          </div>
        )}

        {/* Followers List */}
        {activeTab === 'followers' && (
          <div role="tabpanel" aria-labelledby="followers-tab">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">People following you</h2>
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
                icon={<FaUser className="text-gray-400 text-xl" />}
                title="No followers yet"
                description="When someone follows you, you'll see them here."
              />
            )}
          </div>
        )}

        {/* Following List */}
        {activeTab === 'following' && (
          <div role="tabpanel" aria-labelledby="following-tab">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">People you're following</h2>
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
                icon={<FaUserPlus className="text-gray-400 text-xl" />}
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

// Empty state component for reuse
const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-10">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default FollowView;
