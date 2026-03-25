"use client"
import React from 'react';

import { useSession } from 'next-auth/react';
import { placeOrder } from '@/actions/server/sendEmail';

const MailButton = () => {
    const session = useSession();

    const handleClick = async () => {
        const order = {
            email: `${session?.data?.email}`,
            items: [
                {
                    title: "Flash Cards",
                    price: 874,
                    quantity: 2,
                },
                {
                    title: "Book",
                    price: 500,
                    quantity: 1,
                },
            ],
        };
        const result = await placeOrder(order)
        console.log(result)
    }
    return (
        <div>
            <button onClick={handleClick} className="btn btn-primary">send Mail </button>
        </div>
    );
};

export default MailButton;