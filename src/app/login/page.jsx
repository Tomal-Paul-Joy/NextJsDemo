"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Swal from "sweetalert2";

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get callback URL from query or default to home page
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl
        });

        if (result?.ok) {
            // Success: show alert then redirect
            Swal.fire("Success", "Login successful!", "success").then(() => {
                router.push(callbackUrl);
            });
        } else {
            // Failure: show alert
            Swal.fire("Error", "Email or password not matched", "error");
        }
    };

    const handleGoogleLogin = () => {
        const callbackUrl = searchParams.get("callbackUrl") || "/";

        signIn("google", { callbackUrl }); // must be a valid path
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to your account
                </h2>

                {/* Credentials Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4 text-gray-500">or</div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full border py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    Sign in with Google
                </button>

                {/* Register Link */}
                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => router.push("/register")}
                        className="text-blue-600 cursor-pointer hover:underline"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;