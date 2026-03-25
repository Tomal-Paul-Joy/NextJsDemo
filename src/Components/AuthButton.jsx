"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthButton = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    if (status === "loading") {
        return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (session) {
        return (
            <button onClick={() => signOut()}>
                Sign Out
            </button>
        );
    }

    return (
        <button onClick={() => router.push("/login")}>
            Login
        </button>
    );
};

export default AuthButton;