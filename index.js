const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('I am runnig volunteer network')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfro9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    const database = client.db('volunteer-db')
    const categoriCollection = database.collection('categories')
    const eventsCollection = database.collection('events')

    //find all categories api
    app.get('/categories', async (req, res) => {
      const cursor = categoriCollection.find({})
      const result = await cursor.toArray()
      res.send(result)
    })

    //find a categorie api

    app.get('/categorie/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await categoriCollection.findOne(query)
      res.send(result)
    })

    //post api for selected events
    app.post('/events', async (req, res) => {
      const event = req.body;
      console.log(event)
      const result = await eventsCollection.insertOne(event)
      res.json(result)
    })

    //get events
    app.get('/events', async (req, res) => {
      const cursor = eventsCollection.find({})
      const result = await cursor.toArray()
      res.send(result)
    })

    //delete event

    app.delete('/events/:id', async (req, res) => {
      const id = req.params.id
      const query = { '_id': ObjectId(id) }
      const result = await eventsCollection.deleteOne(query)
      res.send(result)
    })

  } finally {
    // await client.close()
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log('Hiiting port no: ', port)
})