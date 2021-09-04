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

  app.post("/insertAndUpdate", (req, res) => {

    const customers = [{
      email: "anurag11@yopmail.com",
      name: "Riyad"
    },
    {
      email: "sameer11@yopmail.com",
      name: "sameer"
    },
    {
      email: "ravi11@yopmail.com",
      name: "ravi"
    },
    {
      email: "akash11@yopmail.com",
      name: "akash"
    },
    {
      email: "anjali11@yopmail.com",
      name: "anjai"
    },
    {
      email: "santosh11@yopmail.com",
      name: "santosh"
    },
    ]
    customers.map(customer => {

      userEmailCollection.find({ email: customer.email })
        .toArray((err, documents) => {

          if (documents.length > 0) {

            userEmailCollection.updateOne(
              { email: customer.email },

              {
                $set: { name: customer.name },
              }
            )
              .then((result) => {
              });

          }
          else {
            userEmailCollection
              .insertOne({ email: customer.email, name: customer.name })
              .then((result) => {
                console.log("inserted");

              });
          }
        })
    })


  });




  app.get("/subjectByStudent", (req, res) => {
    const studentName = req.query.search

    subjectsCollection.find({ name: studentName }).toArray((err, documents) => {
      res.send(documents);
      console.log(documents);

    });


  });

  app.post("/addUser", (req, res) => {
    const userPhoneNumber = req.body.phoneNumber
    console.log(userPhoneNumber);

    usersCollection.find({ phoneNumber: userPhoneNumber })
      .toArray((err, documents) => {

        if (documents.length > 0) {
          res.send("already have included the number ")

        }
        else {
          usersCollection
            .insertOne({ phoneNumber: userPhoneNumber })
            .then((result) => {
              res.send(result.insertedCount > 0);

            });
        }
      })

  });


});


// test 4
const person = {
  id: 2,
  gender: 'mail'
};
const student = {
  name: "ravi",
  email: "ravi11@yopmail.com"
};
const newmargedObject = { ...person, ...student }
// console.log(newmargedObject);

// task 4 end

// task 6(this function will work only for one missing value between 1-100)

const findMissingNumber = () => {
  let hundradNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
    84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
    96, 97, 98, 99, 100]
  let total = 0;

  const middleValue = 100 * (100 + 1) / 2
  for (let i = 0; i < hundradNumbers.length; i++) {
    total = hundradNumbers[i] + total;

  }
  console.log(middleValue - total);

}
findMissingNumber()

//task -5(I did not understand the question properly, I have done this task base on my understanding)
function getGoogleHomePage(finalCallBack) {
  request('http://www.google.com', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    finalCallBack(error);
    console.log('statusCode:', response && response.statusCode); // Print the response status
    if (!error && response.statusCode == 200) {
      console.log('body:', body); // Print the HTML for the Google homepage.
      finalCallBack(null, body);
    }

  
  });
};


app.get('/getGoogleHomePage', function (req, res) {

  const  data = getGoogleHomePage();
  console.log(data);
  //res.setHeader('Content-Type', 'application/json');
  res.send(data);
});





app.listen(process.env.PORT || port);
