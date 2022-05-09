const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sai9t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db('warehouse').collection('items');
        const manageCollection = client.db('warehouse').collection('manage')

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/items/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const item = await itemsCollection.findOne(query);
            res.send(item);
        });

        //POST
        app.post('/items', async(req, res) =>{
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        

        //DELETE
        app.delete('/items/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        });

        // Item Collection API

        app.get('/myitem', async(req, res) =>{
            const query = {};
            const cursor = itemsCollection.find(query);
            const item = await cursor.toArray();
            res.send(item);
        });


        // manage Collection API
        app.post('/manage', async(req, res) =>{
            const manage = req.body;
            const result = await manageCollection.insertOne(manage);
            res.send (result);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from my warehouse server!!')
});

app.listen(port, () => {
    console.log('Listening to port', port);
})