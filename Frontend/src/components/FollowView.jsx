import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../context/UserContext';
import { FaUser, FaUserCheck, FaUserPlus, FaTimes } from 'react-icons/fa';

const FollowView = () => {
  const { followers, following, getFollower, followUser, userData } = useContext(UserDataContext);
  const [activeTab, setActiveTab] = useState('followers');
  const [loadingFollow, setLoadingFollow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoadingFollow(true);
      try {
        await getFollower();
      } catch (error) {
        console.error("Error fetching follow data:", error);
      } finally {
        setLoadingFollow(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

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
          >
            <FaUser className="mr-2" />
            Followers {followers && <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{followers.length}</span>}
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('following')}
          >
            <FaUserCheck className="mr-2" />
            Following {following && <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{following.length}</span>}
          </button>
        </div>

        {/* Followers List */}
        {activeTab === 'followers' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">People following you</h2>
            {followers && followers.length > 0 ? (
              <div className="space-y-4">
                {followers.map((follower) => (
                  <div key={follower._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        {follower.avatar ? (
                          <img src={follower.avatar} alt={follower.username} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <FaUser className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{follower.username}</h3>
                        <p className="text-sm text-gray-600">{follower.name || `${follower.firstName} ${follower.lastName}`}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(follower._id)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Follow Back
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No followers yet</h3>
                <p className="text-gray-500">When someone follows you, you'll see them here.</p>
              </div>
            )}
          </div>
        )}

        {/* Following List */}
        {activeTab === 'following' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">People you're following</h2>
            {following && following.length > 0 ? (
              <div className="space-y-4">
                {following.map((followedUser) => (
                  <div key={followedUser._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        {followedUser.avatar ? (
                          <img src={followedUser.avatar} alt={followedUser.username} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <FaUser className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{followedUser.username}</h3>
                        <p className="text-sm text-gray-600">{followedUser.name || `${followedUser.firstName} ${followedUser.lastName}`}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(followedUser._id)}
                      className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserPlus className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">Not following anyone yet</h3>
                <p className="text-gray-500">When you follow someone, you'll see them here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowView;