
import React from 'react';
import { getCart } from '@/actions/server/cart';
import CartItem from '@/Components/CartItem';
import MailButton from '@/Components/MailButton';

const CartPage = async () => {
    const cartItems = await getCart();
    console.log(cartItems[0])


    return (
        <div>
            <div>
                <h2 className="text-4xl py-4 font-bold border-l-8 border-primary pl-8">
                    MyCart
                </h2>
                <p className="py-3">
                    <span className="text-primary font-bold">{cartItems.length}</span> {" "} items found in the cart

                </p>
            </div>
            <div className="flex">
                <div className="flex-3">

                    {
                        cartItems.map(item => (
                            <CartItem key={item._id.toString()} item={{ ...item, _id: item._id.toString() }}>

                            </CartItem>
                        ))
                    }

                </div>



            </div>
            <MailButton></MailButton>



        </div>
    );
};

export default CartPage;