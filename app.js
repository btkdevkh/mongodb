const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

// Init App & Middleware
const app = express()
app.use(express.json())

// Connect to DB
let db

connectToDb((err) => {
  if(!err) {
    app.listen(5000, () => console.log('App listen on port 5000'))

    db = getDb()
  }
})

// Routes
app.get('/', (req, res) => {
  res.status(200).json('API Ready')
})

app.post('/books', (req, res) => {
  const book = req.body
  db.collection('books')
    .insertOne(book)
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json(err))
})

app.get('/books', (req, res) => {
  const page = req.query.p || 0
  const booksPerPage = 1

  let books = []

  db.collection('books')
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => res.status(200).json(books))
    .catch(err => res.status(500).json(err))
})

app.get('/books/:id', (req, res) => {
  if(ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => res.status(200).json(doc))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json({ error: 'Not a valid id' })
  }
})

app.delete('/books/:id', (req, res) => {
  if(ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json({ error: 'Not a valid id' })
  }
})

app.patch('/books/:id', (req, res) => {
  const update = req.body

  if(ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .updateOne({ _id: ObjectId(req.params.id) }, {$set: update})
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json({ error: 'Not a valid id' })
  }
})
