const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oq5xc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(fileUpload());

const port = 5000;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {

  const jobseekersCollection = client.db("virtual-jobseekers").collection("jobseekers");
 
  app.get("/", (req, res) => {
    res.send("hello from db it's working working");
  
  });
  app.get("/jobseekers", (req, res) => {
    jobseekersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/searchedJob", (req, res) => {
    const search= req.query.search
    jobseekersCollection.find({location:{$regex:search}}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  

    app.post("/addEmployee", (req, res) => {
    
      console.log(req.body);
       jobseekersCollection
       .insertOne(req.body)
        .then((result) => {
          res.send(result.insertedCount > 0);
        });
    });
  
  

    



  
 
  









  app.patch("/update/:id", (req, res) => {
    const newCondition = req.body.status;
    console.log(newCondition);
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },

        {
          $set: { status: newCondition },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
  app.delete("/delete/:id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(process.env.PORT || port);
