// src/app/products/[id]/page.jsx

import React from "react";
import Image from "next/image";
import { getSingleProduct } from "@/actions/server/product";
import CartButton from "@/Components/CartButton";

const ProductPage = async ({ params }) => {
    const { id } = await params; // params is already an object

    const product = await getSingleProduct(id);

    if (!product) {
        return (
            <div className="text-center mt-10 text-xl">
                Product not found
            </div>
        );
    }

    const discountedPrice = Math.round(product.price * (100 - (product.discount || 0)) / 100);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-80">
                    <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.title || "Product Image"}
                        fill
                        className="object-cover rounded-lg"
                    />
                    {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <h2 className="text-xl text-gray-700">{product.bangla}</h2>

                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-2xl font-semibold text-green-600">৳ {discountedPrice}</span>
                        {product.discount > 0 && (
                            <span className="line-through text-gray-400">৳ {product.price}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>⭐ {product.ratings} / 5</span>
                        <span>({product.reviews} reviews)</span>
                        <span>Sold: {product.sold}</span>
                    </div>

                    {/* Cart Button */}
                    <CartButton product={product} />

                    {product.info?.length > 0 && (
                        <ul className="mt-4 list-disc list-inside text-gray-700">
                            {product.info.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Q&A */}
            {product.qna?.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-2">Q & A</h3>
                    <div className="space-y-4">
                        {product.qna.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{item.question}</p>
                                <p className="text-gray-700">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;