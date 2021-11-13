const express = require('express');
// ____ cors ---
const cors = require ('cors');
//
const ObjectId = require('mongodb').ObjectId;

// ____ mongo client ___ 
const { MongoClient } = require('mongodb');
// ____ secuer pass ___ 
require('dotenv').config()
const app =express();
const port =5000;
 
// ____ middleware__
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0k3m9.mongodb.net/myFirstDatabase?
retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run (){
    try{
await client.connect();
console.log('database connected successfully');
// ++++++++++++++++++++++++++ database and collections ++++++++++ 

const database = client.db('essential_oils');
const productsCollection = database.collection('products');
const customerCullection =database.collection('customers');
const usersCollection =database.collection('users');
const reviewsCollection =database.collection('reviews');

// ++++++++++++++++++++++++ close collection +++++++++++++++ 
            //    _____________ get api Products ____ 
               app.get('/products', async(req,res)=>{
                const cursor = productsCollection.find({});
                const products =await cursor.toArray();
                res.send(products);
            })
            //  post api products
            app.post('/products', async(req,res)=>{
                const product= req.body;
                console.log('hit api ',product);
 
                
  const result= await productsCollection.insertOne(product);
 console.log(result);
 res.json(result)
})
                // delete product from manage product

            app.delete('/products/:id', async(req,res)=>{
                const id =req.params.id;
                const query ={_id:ObjectId(id)};
                const result =await productsCollection.deleteOne(query);
                res.json(result);
         
         })


 //   ___________ Find one ___ 
 app.get ('/products/:id',async(req,res)=>{
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const product = await productsCollection.findOne(query);
    res.json(product);

})



           
         
       //  -____________  Get api CUSTOMERS  _________ 
       
        app.get('/customers', async (req, res) => {
            const customerEmail = req.query.customerEmail;
            
            const query = { email: customerEmail }
console.log(query);
            const cursor =  customerCullection.find(query);
            // console.log(query);
            const customers = await cursor.toArray();
            res.json(customers);
        })

//  -____________ CUSTOMERS POST API _________ 
app.post('/customers', async (req, res) => {
    const customer = req.body;
    const result = await customerCullection.insertOne(customer);
    console.log(customer);
    res.json(result)
});
app.delete('/customers/:id', async(req,res)=>{
    const id =req.params.id;
    const query ={_id:ObjectId(id)};
    const result =await customerCullection.deleteOne(query);
    res.json(result);

})
// _______________________________________________________________________________________________

app.post("/customers", async (req, res) => {
  const result = await customerCullection.insertOne(req.body);
  res.send(result);
});

//  my order

app.get("/customers/:email", async (req, res) => {
  console.log(req.params.customerEmail);
  const result = await customerCullection
    .find({customerEmail: req.params.email })
    .toArray();
  res.send(result);
});

// _________________________________________________________________________________________
// +++++++++++++++ reviews ++++++++++++ 
app.get('/reviews', async(req,res)=>{
    const cursor = reviewsCollection.find({});
    const reviews =await cursor.toArray();
    res.send(reviews);
})


//  post api products
app.post('/reviews', async(req,res)=>{
    const review= req.body;
    console.log('hit api ',review);

    
const result= await reviewsCollection.insertOne(review);
console.log(result);
res.json(result)
})


    //     //   ___________ Find one ___ 
    //      app.get ('/products/:id',async(req,res)=>{
    //         const id = req.params.id;
    //         const query = { _id: ObjectId(id) };
    //         const product = await productsCollection.findOne(query);
    //         res.json(product);
     
    //  })

// __________________ user __________ 
     app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.json(result);
    });
    app.put('/users', async (req, res) => {
        const user = req.body;
        // console.log('put',user);
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });
  
// +++++++++++++++++++++++



app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
})



// verifyToken, 
    app.put('/users/admin', async (req, res) => {
        const user = req.body;
        console.log('put',user);

        // const requester = req.decodedEmail;
        // if (requester) {
            // const requesterAccount = await usersCollection.findOne({ email: requester });
        //     if (requesterAccount.role === 'admin') {
                const filter = { email: user.email };
                const updateDoc = { $set: { role: 'admin' } };
                const result = await usersCollection.updateOne(filter, updateDoc);
                res.json(result);
        //     }
        // }
        // else {
        //     res.status(403).json({ message: 'you do not have access to make admin' })
        // }

    })

    // ++++++++++++++++++++++++

} 
finally{
       
        //        await client.close();
}       
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('running Essantial oils');
    })
     
    app.listen(port ,()=>{
                   console.log("running Essantial oils on porat", port)
    })