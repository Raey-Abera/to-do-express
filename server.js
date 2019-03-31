const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://student:student@cluster0-6iakl.mongodb.net/test?retryWrites=true";
const dbName = "todo";

app.listen(3000, () => {
    MongoClient.connect(url, /*{ useNewUrlParser: true },*/ (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  console.log(db)
  db.collection('list').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('list').save({name: req.body.name, checkMark: false},(err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  db.collection('list').findOneAndUpdate({name: req.body.name},
{
  $set: {
    checkMark:true
  },
},{
  sort: {_id: -1},
  upsert: true
},

    (err, result) => {
    if (err) return res.send(err)
    console.log('Item Checked Off List')
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('list').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
