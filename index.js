const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oq5xc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const usersCollection = client.db("virtual-jobseekers").collection("userWIthPhone");
  const subjectsCollection = client.db("virtual-jobseekers").collection("studentSubjects");
  const userEmailCollection = client.db("virtual-jobseekers").collection("userEmail");

  app.get("/", (req, res) => {
    res.send("hello from db it's working working");

  });



  app.get("/student", (req, res) => {

    usersCollection.find({  }).toArray((err, documents) => {
      res.send(documents);
      console.log(documents);

    });


  });

  app.post("/addEmployee", (req, res) => {
    const newData = req.body
    console.log(newData);

    usersCollection
    .insertOne(newData)
    .then((result) => {
      res.send(result.insertedCount > 0);

    });


  });


});









app.listen(process.env.PORT || port);
