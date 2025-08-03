import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/Logo1.svg";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
    });
    const [loding, setLoding] = useState(false)
    const [error, setError] = useState('')
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoding(true)
        try {
            const res = await axios.post(
                "http://localhost:4000/api/auth/login",
                {
                    email: formData.emailOrUsername.includes("@")
                        ? formData.emailOrUsername
                        : undefined,
                    username: !formData.emailOrUsername.includes("@")
                        ? formData.emailOrUsername
                        : undefined,
                    password: formData.password,
                },
                { withCredentials: true }
            );
            console.log(res.data);
            if (res.data.statusCode === 200) {
                const data = res.data.data;
                localStorage.setItem('token', data.token);
                alert("Login successful!");
                setFormData({
                    emailOrUsername: "",
                    password: "",
                })
                setLoding(false)
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || "Login failed");
            setError(error.response)
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Logo */}
            <div className="p-4">
                <img src={Logo} alt="LinkedIn Logo" className="h-8 mx-auto sm:mx-0" />
            </div>

            {/* Login Card */}
            <div className="flex items-center justify-center py-10">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-semibold text-center mb-6">Sign in</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email or Username */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                name="emailOrUsername"
                                value={formData.emailOrUsername}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter email or username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm font-bold text-gray-600 hover:text-gray-800"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-lg font-medium"
                        >
                            {loding?"Loading...":"Sign in"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-gray-600 text-sm">
                        New to LinkedIn?{" "}
                        <a href="/signup" className="text-blue-600 hover:underline font-medium">
                            Join now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
