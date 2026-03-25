
const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = "mongodb+srv://herokidz:ALUDL2E3hNuU067x@cluster0.xlma3wo.mongodb.net/?appName=Cluster0"
// const dName = "herokidzdb"
const uri = process.env.MONGODB_URI;
const dName = process.env.DB_NAME;

export const collections = {
    products: "products",
    users: "users",
    cart: "cart",
};


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export const dbConnect = async (cname) => {
    return client.db(dName).collection(cname);
};