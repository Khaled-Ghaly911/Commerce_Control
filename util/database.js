// //QH8zfkIr6C44mHjn

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://khaledghaly000:QH8zfkIr6C44mHjn@cluster0.s5xgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


////////////////


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb+srv://khaledghaly000:GBB0E51tpBaccRPa@cluster0.s5xgw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0")
    .then(client => {
      console.log('Connected!');
      _db = client.db();//store access to the database
      callback(client);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database found!'
}


module.exports = {
  mongoConnect,
  getDb
};

///////////////////////////////////

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://khaledghaly000:QH8zfkIr6C44mHjn@cluster0.s5xgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let _db;

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// module.exports = {
//   client,

// }
