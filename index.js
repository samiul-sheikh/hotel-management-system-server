const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8000;

const app = express()

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://burjAdmin:burjAdmin71@cluster0.2uohe.mongodb.net/burjAlArab?retryWrites=true&w=majority";
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
        bookings.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)