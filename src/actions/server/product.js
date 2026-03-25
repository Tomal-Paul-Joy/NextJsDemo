"use server";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const getProducts = async () => {
    const collection = await dbConnect(collections.products);
    const products = await collection.find().toArray();
    return products;
};

export const getSingleProduct = async (id) => {
    if (!id || id.length !== 24) return null;

    const query = { _id: new ObjectId(id) };
    const collection = await dbConnect(collections.products);

    const product = await collection.findOne(query);



    return { ...product, _id: product._id.toString() } || {};
}