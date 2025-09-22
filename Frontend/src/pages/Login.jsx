import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo1.svg';
import { UserDataContext } from '../context/UserContext';
import { AuthDataContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserDataContext);
  let { serverUrl } = useContext(AuthDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [loding, setLoding] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoding(true);
    try {
      const res = await axios.post(
        serverUrl + '/auth/login',
        {
          email: formData.emailOrUsername.includes('@')
            ? formData.emailOrUsername
            : undefined,
          username: !formData.emailOrUsername.includes('@')
            ? formData.emailOrUsername
            : undefined,
          password: formData.password,
        },
        { withCredentials: true },
      );
      if (res.data.statusCode === 200) {
        const data = res.data.data;
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        setUserData(data.user);
        setFormData({
          emailOrUsername: '',
          password: '',
        });
        navigate('/');
        setLoding(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed');
      setError(error.response);
      setLoding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <img src={Logo} alt="LinkedIn Logo" className="mx-auto h-8 sm:mx-0" />
      </div>
      <div className="flex items-center justify-center py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-semibold">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email or Username
              </label>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email or username"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm font-bold text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-lg font-medium text-white transition-all hover:bg-blue-700"
            >
              {loding ? 'Loading...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            New to LinkedIn?{' '}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Join now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
