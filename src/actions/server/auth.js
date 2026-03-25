"use server";
import { collections, dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const postUser = async (payload) => {
    const { name, email, password } = payload;

    // check payload
    if (!email || !password) return null;

    const collection = await dbConnect(collections.users);

    // check if user exists
    const isExist = await collection.findOne({ email });
    if (isExist) return null;

    // create user
    const newUser = {
        provider: "credentials",
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "user"
    };

    // insert user
    const result = await collection.insertOne(newUser);

    if (result.acknowledged) {
        return {
            ...newUser,
            _id: result.insertedId.toString()
        };
    }

    return null;
};
export const loginUser = async (payload) => {
    const { email, password } = payload;
    if (!email || !password) return null;
    const collection = await dbConnect(collections.users);
    const user = await collection.findOne({ email });
    if (!user) return null;
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return null;
    console.log("yeah", user)
    return user;


}