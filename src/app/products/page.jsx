import React from 'react';
import Products from '@/Components/Home/Products';
export const metadata = {
    title: "Products",
    description: "Our Products"
}

const ProductsPage = () => {

    return (
        <div>
            <Products></Products>
        </div>
    );
};

export default ProductsPage;