"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { handleCart } from "@/actions/server/cart";
import React, { useState } from "react";
import Swal from "sweetalert2";

const CartButton = ({ product }) => {
    const { status } = useSession();
    const isLogin = status === "authenticated";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const path = usePathname();

    const handleAdd2Cart = async () => {
        setIsLoading(true);

        if (!isLogin) {
            router.push(`/login?callbackUrl=${path}`);
            setIsLoading(false);
            return;
        }

        try {
            const result = await handleCart({ product, inc: true });
            if (result?.success) {
                Swal.fire("Added to cart", product?.title, "success");
            } else {
                Swal.fire("OOPS", "Something went wrong", "error");
            }
        } catch (err) {
            console.error("Cart error:", err);
            Swal.fire("Error", "Failed to update cart", "error");
        }

        setIsLoading(false);
    };

    return (
        <button
            disabled={status === "loading" || isLoading}
            onClick={handleAdd2Cart}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            {isLoading ? "Adding..." : "Add to Cart"}
        </button>
    );
};

export default CartButton;