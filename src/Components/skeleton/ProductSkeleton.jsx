import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 animate-pulse">

            {/* Image */}
            <div className="w-full h-52 bg-gray-300 rounded-xl"></div>

            {/* Content */}
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>

                <div className="flex gap-2 mt-2">
                    <div className="h-5 bg-gray-300 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>

                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );
};

export default ProductSkeleton;