import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo1.svg';
import { AuthDataContext } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  let { serverUrl } = useContext(AuthDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(serverUrl + `/auth/register`);

    try {
      const res = await axios.post(serverUrl + `/auth/register`, formData);
      // console.log(res);

      if (res.data.statusCode === 200) {
        alert('Account created successfully!');
        setFormData({
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
        });
        setLoading(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <img src={Logo} alt="LinkedIn Logo" className="mx-auto h-8 sm:mx-0" />
      </div>
      <div className="flex items-center justify-center py-2 md:py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-semibold">
            Join LinkedIn
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email"
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
              {loading ? 'Loading...' : 'Sign up'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
