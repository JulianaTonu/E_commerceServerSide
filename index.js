const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qdgqirr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const eCommerceCollection = client.db("eCommerceDb").collection("eCommerce");
    const cartCollection = client.db("eCommerceDb").collection("cartItem");
    const userCollection = client.db("eCommerceDb").collection("Users");

    app.get('/product', async (req, res) => {
      const query = {}
      const cursor = eCommerceCollection.find(query)
      const product = await cursor.toArray()
      res.send(product)
    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await eCommerceCollection.findOne(query)
      res.send(product);

    })

    //cart collection
    app.get('/carts', async (req, res) => {
      const query = {}
      const cursor = cartCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/carts/email', async (req, res) => {
      let email = req.query.email;
      const query = { email: email }
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem)
      res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('E-commerce server is running')
})

app.listen(port, () => {
  console.log(`E-commerce Server is running on port: ${port}`)
})
