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


        app.get('/productsCatBrand', async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const { searchProduct, brand, category, priceRange, sortBy } = req.query
            let query = {}
            let sort = {};

            if (searchProduct) {
                query = { title: { $regex: searchProduct, $options: 'i' } };

            }

            if (brand) {
                query = { brand: brand }
            }

            if (category) {
                query = { category: category }
            }
            if (priceRange) {
                const lessPrice = parseInt(priceRange.split('-')[0])
                const overPrice = parseInt(priceRange.split('-')[1])
                query.price = { $gte: lessPrice, $lte: overPrice };

            }

            if (brand && category) {
                query = { brand: brand, category: category }
            }
            if (brand && priceRange) {
                const lessPrice = parseInt(priceRange.split('-')[0])
                const overPrice = parseInt(priceRange.split('-')[1])
                query = { brand: brand, price: { $gte: lessPrice, $lte: overPrice } }
            }
            if (category && priceRange) {
                const lessPrice = parseInt(priceRange.split('-')[0])
                const overPrice = parseInt(priceRange.split('-')[1])
                query = { category: category, price: { $gte: lessPrice, $lte: overPrice } }
            }


            if (brand && category && priceRange) {
                const lessPrice = parseInt(priceRange.split('-')[0])
                const overPrice = parseInt(priceRange.split('-')[1])
                query.price = { $gte: lessPrice, $lte: overPrice };

                query = { brand: brand, category: category, price: { $gte: lessPrice, $lte: overPrice } }
            }


            if (sortBy === 'priceAsc') {
                sort.price = 1;
            } else if (sortBy === 'priceDesc') {
                sort.price = -1;
            } else if (sortBy === 'dateDesc') {
                sort.createdAt = -1;
            }

            try {
                const result = await productsCollection.find(query).sort(sort).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to retrieve products", error });
            }
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