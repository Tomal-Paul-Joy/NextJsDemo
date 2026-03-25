import React from 'react';

import ProductSkeleton from '@/Components/skeleton/ProductSkeleton';

const loading = () => {
    return (
        <div className="grid md:grid-cols-3 gap-5">
            {
                [...Array(9)].map((_, index) => <ProductSkeleton key={index}></ProductSkeleton>)
            }

        </div>
    );
};

export default loading;