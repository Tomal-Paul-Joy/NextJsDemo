"use server"
import { authOptions } from "@/lib/authOptions";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";
import { getServerSession } from "next-auth";


export const placeOrder = async (orderData) => {

    // 👉 Save order to DB first



    await sendInvoiceEmail({
        userEmail: orderData.email,
        order: orderData,
    });

    return { success: true };
};