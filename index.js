const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.port || 5000;
const crypto = require('crypto')
const cors = require('cors');
app.use(cors());
app.use(express.json());
const admin = require("firebase-admin");
// const serviceAccount = require("./firebaseadminsdk.json");
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// use $in for those if one of any available 
// use $nin for those if others except them

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.xlma3wo.mongodb.net/?appName=Cluster0`;
const stripe = require('stripe')(process.env.Stripe_Secret);
function generateTrackingId() {
    const prefix = "PRCL";
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();

    return `${prefix}-${date}-${random}`;
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const db = client.db('ZapShiftDB');
        const parcelCollections = db.collection('parcels');
        const paymentCollections = db.collection('payments');
        const userCollections = db.collection('users');
        const riderCollections = db.collection('riders');
        const verifyAdmin = async (req, res, next) => {

            const email = req.decoded_email;
            const query = { email };
            const user = await userCollections.findOne(query);
            if (!user || user.role !== 'Admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();



        }



        const verifyFbToken = async (req, res, next) => {
            console.log(req.headers.authorization)
            const token = req.headers?.authorization;
            console.log(token);
            if (!token) {
                return res.status(401).send({
                    message: `unauthorized access`
                })
            }
            try {
                const idToken = token.split(' ')[1]
                const decoded = await admin.auth().verifyIdToken(idToken)
                console.log(decoded)
                req.decoded_email = decoded.email
                next();
            }
            catch (error) {

                return res.status(401).send({
                    message: "unauthorized access "
                })

            }

        }
        app.get('/users/:id', async (req, res) => {

        })

        app.get('/users/:email/role', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ role: user?.role || 'user' })
        })

        app.patch('/users/:id/role', verifyFbToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const roleInfo = req.body;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: roleInfo.role,


                }
            }
            const result = await userCollections.updateOne(query, updatedDoc)
            res.send(result);
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const roleInfo = req.body;

            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: roleInfo.role
                }
            };

            const result = await userCollections.updateOne(query, updatedDoc);
            res.send(result);
        });
        app.get('/riders', async (req, res) => {
            try {
                const query = {};

                if (req.query.status === 'pending') {
                    query.status = 'pending';
                }

                const result = await riderCollections.find(query).toArray();
                res.send(result);
            }
            catch (error) {
                res.status(500).send({ message: 'Server error', error });
            }
        });
        app.post('/riders', async (req, res) => {
            const rider = req.body;
            rider.status = 'pending';
            rider.createdAt = new Date();
            const result = await riderCollections.insertOne(rider);
            res.send(result);

        })
        app.get('/users', async (req, res) => {
            const searchText = req.query.searchText;
            const query = {};
            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: 'i' } },
                    { email: { $regex: searchText, $options: 'i' } }
                ]
            }
            const cursor = userCollections.find(query).sort({ createdAt: -1 }).limit(5);
            const result = await cursor.toArray();
            res.send(result);

        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            user.role = "user";
            user.createdAt = new Date();
            const email = user.email;
            const userExists = await userCollections.findOne({ email });
            if (userExists) {
                return res.send({ message: 'user exits' })
            }

            const result = await userCollections.insertOne(user)
            res.send(result)
        })
        app.get('/parcels', async (req, res) => {



            const query = {};
            const { email, deliveryStatus } = req.query;



            if (email) {
                query["data.senderEmail"] = email;


            }
            if (deliveryStatus) {
                query.deliveryStatus = deliveryStatus;
            }
            const options = { sort: { createdAt: -1 } };

            const cursor = parcelCollections.find(query, options);
            const parcels = await cursor.toArray();
            res.send(parcels);

        })

        app.post('/payment-checkout-session', async (req, res) => {
            try {
                const paymentInfo = req.body;

                if (!paymentInfo.cost) {
                    return res.status(400).json({ error: 'Cost is required' });
                }

                const amount = parseInt(paymentInfo.cost) * 100;
                const YOUR_DOMAIN = "http://localhost:5173";

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                unit_amount: amount,
                                product_data: {
                                    name: `Payment for parcel ${paymentInfo.parcelName}`,
                                },
                            },
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        parcelId: paymentInfo.parcelId,
                    },
                    mode: 'payment',
                    success_url: `${YOUR_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${YOUR_DOMAIN}/dashboard/payment-cancelled`,
                });

                res.json({ url: session.url });

            } catch (error) {
                console.error('Stripe error:', error);
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/payments', verifyFbToken, async (req, res) => {
            const email = req.query.email;

            const query = {}
            if (email) {
                query.customerEmail = email

                if (email != req.decoded_email) {
                    return res.status(403).send({
                        message: 'forbidden access '
                    })
                }
            }
            const cursor = paymentCollections.find(query).sort({ paidAt: 1 })
            const result = await cursor.toArray()
            res.send(result)
        })
        app.patch('/payment-success', async (req, res) => {
            const session_id = req.query.session_id;
            //console.log(session_id);
            const session = await stripe.checkout.sessions.retrieve(session_id);
            console.log(`session`, session);
            const transactionId = session.payment_intent;
            const query = {
                transactionId: transactionId,
            }
            const paymentExist = await paymentCollections.findOne(query);
            if (paymentExist) {
                return res.send({
                    message: 'already exist',
                    transactionId,
                    trackingId: paymentExist.trackingId,
                })
            }
            const trackingId = generateTrackingId();
            if (session.payment_status === 'paid') {
                const id = session.metadata.parcelId;
                const query = { _id: new ObjectId(id) };
                const update = {
                    $set: {
                        paymentStatus: 'Paid',
                        deliveryStatus: 'pending-pickup',
                        trackingId: trackingId,

                    }
                }
                const result = await parcelCollections.updateOne(query, update);
                const payment = {
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    customerEmail: session.customer_details?.email,
                    parcelId: session.metadata.parcelId,
                    parcelName: session.metadata.parcelName,
                    transactionId: session.payment_intent,
                    paymentStatus: session.payment_status,
                    paidAt: new Date(),
                    trackingId: trackingId


                }
                if (session.payment_status == 'paid') {

                    const resultPayment = await paymentCollections.insertOne(payment)
                    res.send({
                        success: true,
                        trackingId: trackingId,
                        transactionId: session.payment_intent,
                        modifyParcel: result, paymentInfo: resultPayment
                    })
                }


            }
            res.send({ success: false })
        })

        app.post('/create-checkout-session', async (req, res) => {
            try {
                const paymentInfo = req.body;

                const amount = parseInt(paymentInfo.cost) * 100;

                const YOUR_DOMAIN = 'http://localhost:5173';

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                unit_amount: amount,
                                product_data: {
                                    name: paymentInfo.parcelName,
                                },
                            },
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        parcelId: paymentInfo.parcelId,
                    },
                    customer_email: paymentInfo.senderEmail,
                    mode: 'payment',
                    success_url: `${YOUR_DOMAIN}/dashboard/payment-success`,
                    cancel_url: `${YOUR_DOMAIN}/dashboard/payment-cancelled`,
                });

                res.json({ url: session.url });

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: error.message });
            }
        });

        app.delete('/parcels/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete', id);
            const query = { _id: new ObjectId(id) };
            const result = await parcelCollections.deleteOne(query);
            res.send(result);
        })
        app.get('/parcels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await parcelCollections.findOne(query);
            res.send(result);

        })
        app.post('/parcels', async (req, res) => {
            const parcel = req.body;
            parcel.createdAt = new Date();
            const result = await parcelCollections.insertOne(parcel);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello world ');

})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})