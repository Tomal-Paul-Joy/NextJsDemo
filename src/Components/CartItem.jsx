"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { deleteItemsFromCart, handleCart } from "@/actions/server/cart";
import Swal from "sweetalert2";

const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [loading, setLoading] = useState(false);

    const handleIncrement = async () => {
        setLoading(true);
        const res = await handleCart({ product: { _id: item.productId }, inc: true });

        if (res?.success) {
            setQuantity(prev => prev + 1);
        }
        setLoading(false);
    };

    const handleDecrement = async () => {
        if (quantity <= 1) return;

        setLoading(true);
        const res = await handleCart({ product: { _id: item.productId }, inc: false });

        if (res?.success) {
            setQuantity(prev => prev - 1);
        }
        setLoading(false);
    };

    const handleRemove = async (item) => {
        setLoading(true);

        // simple delete API (you need to implement this)
        const res = await deleteItemsFromCart(item._id);

        if (res.success) {
            Swal.fire("Removed!", item.title, "success");
        } else {
            Swal.fire("Error", "Failed to remove item", "error");
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm bg-base-100">

            {/* Image */}
            <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-primary font-bold">৳ {item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={handleDecrement}
                        disabled={loading}
                        className="btn btn-sm btn-outline"
                    >
                        <FaMinus />
                    </button>

                    <span className="px-3">{quantity}</span>

                    <button
                        onClick={handleIncrement}
                        disabled={loading}
                        className="btn btn-sm btn-outline"
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => handleRemove(item)}
                disabled={loading}
                className="btn btn-error btn-sm text-white"
            >
                <FaTrash />
            </button>
        </div>
    );
};

export default CartItem;