"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProductCards = ({ product }) => {
    const { _id, image, title, discount, bangla, price, reviews, ratings, sold } = product;
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${_id}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4">
            {/* Image */}
            <div className="relative w-full h-52 rounded-xl overflow-hidden">
                <Image
                    src={image || "/placeholder.png"}
                    alt={title || "Product Image"}
                    width={200}
                    height={180}
                    className="object-cover"
                />
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mt-3 space-y-1">
                <h2 className="text-sm font-semibold line-clamp-2">{title}</h2>
                <p className="text-xs text-gray-500">{bangla}</p>

                {/* Price */}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-green-600">
                        ৳{Math.round(price * (100 - discount) / 100)}
                    </span>
                    {discount > 0 && <span className="text-sm text-gray-400 line-through">৳{price}</span>}
                </div>

                {/* Ratings */}
                <div className="text-xs text-yellow-500">
                    ⭐ {ratings} ({reviews} reviews)
                </div>

                {/* Sold */}
                <p className="text-xs text-gray-400">Sold: {sold}</p>

                {/* Button */}
                <button
                    onClick={handleClick}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCards;