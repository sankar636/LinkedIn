import { useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext.jsx';

const NotificationHandler = () => {
  const { userData } = useAuth();
  const user = userData || {};
  const { serverUrl } = useContext(AuthDataContext);
  const getToken = useCallback(() => localStorage.getItem('token'), []);
  useEffect(() => {
    const checkNotificationsOnLogin = async () => {
      if (user) {
        try {
          const token = getToken();
          const response = await axios.post(
            `${serverUrl}/notifications/check-and-clear`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const summary = response.data.data;

          if (summary && summary.total > 0) {
            setTimeout(() => {
              toast.success(`You have ${summary.total} new notification(s)`, {
                duration: 4000,
              });
            }, 4000);
          }
        } catch (error) {
          console.error('Failed to check notifications:', error);
        }
      }
    };
    checkNotificationsOnLogin();
  }, [user]);

  return null;
};

export default NotificationHandler;
