const express = require('express');
const app = express()

const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://urban-shop-92f50.web.app', 'https://urban-shop-92f50.firebaseapp.com']
}))


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.qvnsypp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const productsCollection = client.db('UrbanShop').collection('Products')


        app.get('/products', async (req, res) => {
            const { searchProduct } = req.query
            let query = {}

            if (searchProduct) {
                query = { title: { $regex: searchProduct, $options: 'i' } };
            }

            const result = await productsCollection.find(query).toArray()

            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})
app.listen(port, () => {
    console.log(`mongodb connected on port ${port}`)
})