import { loginUser } from "@/actions/server/auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { collections, dbConnect } from "./dbConnect";
export const authOptions = {
    // Configure one or more authentication providers
    providers: [

        CredentialsProvider({

            name: "Credentials",

            credentials: {
                // username: { label: "Username", type: "text", placeholder: "jsmith" },
                // password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await loginUser(credentials);

                return user;
            }
        })
        ,
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })


    ],
    callbacks: {
        async signIn({ user, account }) {
            // Connect to users collection
            const collection = await dbConnect(collections.users);

            // Check if user already exists
            const isExist = await collection.findOne({
                email: user.email,
                // provider: account?.provider
            });

            if (isExist) {
                return true; // already in DB → allow login
            }

            // New user → insert
            const newUser = {
                provider: account?.provider,
                name: user.name,
                email: user.email,
                image: user.image,
                role: "user"
            };

            const result = await collection.insertOne(newUser);
            return result.acknowledged; // must return true to allow login
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {

            if (token) {
                session.role = token?.role;
                session.email = token?.email;
            }
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {

            if (user) {
                if (account.provider == "google") {
                    const dbUser = await dbConnect(collections.users).findOne({ email: user.email })
                    token.role = dbUser?.role;
                    token.email = dbUser?.email;

                } else {
                    token.role = user?.role;
                    token.email = user?.email;
                }

            }
            return token
        }
    }
}