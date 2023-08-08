const express = require('express');
const app=express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT||5000;


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.yq5wikg.mongodb.net/?retryWrites=true&w=majority`;

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
   
    const usersCollection=client.db("neighborDB").collection("users")
    const userDataCollection=client.db("neighborDB").collection("userData")

    app.post('/users', async(req,res)=>{
        const item=req.body;
        const query={email: item.email}
        const existingUser=await usersCollection.findOne(query)
        if(existingUser){
          return res.send({message: 'You already existing'})
        }
        const result=await usersCollection.insertOne(item)
        res.send(result)
    })
    app.post('/userData', async(req,res)=>{
        const item=req.body;
        const query={email: item.email}
        const existingUser=await userDataCollection.findOne(query)
        if(existingUser){
          return res.send({message: 'You already existing'})
        }
        const result=await userDataCollection.insertOne(item)
        res.send(result)
    })


// get User
app.get('/users',async(req,res)=>{
    const data=req.body
    const result=await usersCollection.find().toArray()
    res.send(result)
  })
// get User
app.get('/userData',async(req,res)=>{
    const data=req.body
    const result=await userDataCollection.find().toArray()
    res.send(result)
  })

  // get one data
app.get('/userData/:email',async(req,res)=>{
    const email=req.params.email
    const query={email:email}
    const result=await userDataCollection.findOne(query)
    res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Hello Neighbor")
})

app.listen(port,()=>{
    console.log(`Neighbor is running now ${port}`)
})