const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const port = 8000;

const app = express()

app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./configs/hotel-management-burj-firebase-adminsdk-1p4rq-0b11d75391.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRE_DB
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("burjAlArab").collection("bookings");

    // create/store data in database
    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking)
            .then(result => {
                // console.log(result);
                res.send(result.insertedCount > 0);
            })
        // console.log(newBooking);
    })

    // read data from database and display UI
    app.get('/bookings', (req, res) => {
        // console.log(req.query.email);
        // console.log(req.headers.authorization);
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            // console.log({ idToken });
            admin
                .auth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    // console.log(tokenEmail, queryEmail);
                    if (tokenEmail == queryEmail) {
                        bookings.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents);
                            })
                    }
                    else {
                        res.status(401).send('unauthorized access');
                    }
                })
                .catch((error) => {
                    res.status(401).send('unauthorized access');
                });
        }
        else {
            res.status(401).send('unauthorized access');
        }
    })
});

app.get('/', (req, res) => {
    res.send('Welcome To Hotel Management System Server!')
})

app.listen(process.env.PORT || port)