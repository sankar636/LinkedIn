import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/Logo1.svg";
import { AuthDataContext } from "../context/AuthContext";

const SignUp = () => {
    const navigate = useNavigate();
    let {serverUrl} = useContext(AuthDataContext)
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        console.log(serverUrl+`/auth/register`);
        
        try {
            const res = await axios.post(serverUrl+`/auth/register`, formData);
            // console.log(res);
            
            if (res.data.statusCode === 200) {
                alert("Account created successfully!");
                setFormData({
                    firstname: "",
                    lastname: "",
                    username: "",
                    email: "",
                    password: "",
                  });
                  setLoading(false)                  
                navigate("/login");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-4">
                <img src={Logo} alt="LinkedIn Logo" className="h-8 mx-auto sm:mx-0" />
            </div>
            <div className="flex items-center justify-center py-2 md:py-10">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-semibold text-center mb-6">Join LinkedIn</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="First name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Last name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter email"
                                required
                            />
                        </div>
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
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-lg font-medium"
                        >
                            {loading ? "Loading...":"Sign up"}
                            </button>
                    </form>
                    <p className="mt-6 text-center text-gray-600 text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
