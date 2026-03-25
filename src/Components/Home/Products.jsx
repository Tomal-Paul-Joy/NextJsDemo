
import React from 'react';

import ProductCards from '../Cards/ProductCards';
import { getProducts } from '@/actions/server/product';

const Products = async () => {
    const products = await getProducts();
    return (
        <div>
            <h2 className="text-center text-4xl font-bold mb-10">Our Products</h2>
            <div className="grid md:grid-cols-3 gap-5">
                {
                    products.map(product => (
                        <ProductCards
                            key={product._id.toString()}
                            product={{ ...product, _id: product._id.toString() }}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Products;