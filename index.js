const express = require('express')
const app = express()
const port = 8000;

const password = "burjAdmin71";


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://burjAdmin:burjAdmin71@cluster0.2uohe.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("burjAlArab").collection("bookings");
    console.log('database connected successfully');
    client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)