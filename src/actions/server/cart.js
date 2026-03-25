"use server";

import { authOptions } from "@/lib/authOptions";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cache, useMemo } from "react";

const cartCollection = await dbConnect(collections.cart);

export const handleCart = async ({ product, inc }) => {

    const { user } = (await getServerSession(authOptions)) || {};

    if (!user) return { success: false };

    const query = { email: user.email, productId: product?._id };
    const isAdded = await cartCollection.findOne(query);

    // Default discount if not provided in product
    const discount = product?.discount || 0;

    if (isAdded) {
        // Calculate new quantity
        let newQuantity = isAdded.quantity + (inc ? 1 : -1);

        // Prevent quantity from going below 1
        if (newQuantity < 1) newQuantity = 1;

        const updatedData = { $set: { quantity: newQuantity } };
        const result = await cartCollection.updateOne(query, updatedData);

        return { success: Boolean(result.modifiedCount) };
    } else {
        const newData = {
            productId: product?._id,
            email: user.email,
            title: product?.title,
            quantity: 1,
            image: product?.image,
            price: product?.price - (product?.price * discount) / 100,
            username: user?.name,
        };

        const result = await cartCollection.insertOne(newData);
        return { success: result.acknowledged };
    }
};
export const getCart = cache(async () => {
    const { user } = (await getServerSession(authOptions)) || {};
    if (!user) {
        return [];
    }
    const query = {
        email: user?.email,
    }
    const result = await cartCollection.find(query).toArray();
    return result;
})
export const deleteItemsFromCart = async (id) => {
    const { user } = (await getServerSession(authOptions)) || {};
    if (!user) return { success: false }
    if (id?.length != 24) {
        return { success: false }
    }
    const query = { _id: new ObjectId(id) }
    const result = await cartCollection.deleteOne(query);
    if (Boolean(result.deletedCount)) {
        revalidatePath("/cart")
    }
    return { success: Boolean(result.deletedCount) }
}