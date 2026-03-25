"use client";
import { postUser } from '@/actions/server/auth';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"

const Register = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const result = await postUser(form);

        if (!result) {
            alert("Registration failed! User may already exist.");
            return;
        }
        alert("Registration successful!");


        const loginRes = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });

        if (loginRes?.ok) {
            router.push("/");
        } else {
            alert("Login failed after registration");
        }
    };
    const handleGoogleSignUp = () => {
        console.log("Google sign up clicked");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Register for your account
                </h2>

                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                        Register
                    </button>
                </form>

                <div className="text-center my-4 text-gray-500">or</div>

                <button
                    onClick={handleGoogleSignUp}
                    className="w-full border py-2 rounded-lg"
                >
                    Sign Up with Google
                </button>
            </div>
        </div>
    );
};

export default Register;