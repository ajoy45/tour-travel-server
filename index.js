const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()
require('dotenv').config()
// user=tour
// pass=yw5NVm1vvRgQ4uIK


const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pw3gk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect()
    const serviceCollection = client.db("tourCar").collection("cars");
    const bookingCollection=client.db('tourCar').collection('booking');

    //  get api
    app.get('/cars', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // get single id
    app.get('/cars/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const service=await serviceCollection.findOne(query)
      res.send(service)
    })
    app.post('/cars',async(req,res)=>{
      const service=req.body;
      const result=await serviceCollection.insertOne(service)
      res.send(result)
    })


    // bookingCollection part
     
    // post add booking api
    app.post('/booking',async(req,res)=>{
       const service=req.body;
       const result=await bookingCollection.insertOne(service)
       res.send(result)
    })

    // get booking data
    app.get('/booking',async(req,res)=>{
      const query={}
      const cursor= bookingCollection.find(query)
      const result=await cursor.toArray()
      res.send(result)
    })
    // delete single booking
    app.delete('/booking/:id',async(req,res)=>{
         const id=req.params.id;
         const query={_id:ObjectId(id)}
         const result=await bookingCollection.deleteOne(query)
         res.send(result)
    })
    // get special user
    app.get('/mybooking/:email',async(req,res)=>{
      const email=req.params.email;
      const query=bookingCollection.find({email})
      const result=await query.toArray()
      res.send(result)
    })
  }
  finally {

  }
}
run().catch(console.dir);

// midleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('connected')
})

app.listen(port, () => {
  console.log('listening')
})