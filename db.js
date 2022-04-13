const { MongoClient } = require('mongodb')

let dbConnection

function connectToDb(callback) {
  const MONGODB_URI = 'mongodb://localhost:27017/bookstore'
  MongoClient.connect(MONGODB_URI)
    .then((client) => {
      dbConnection = client.db()
      return callback()
    })
    .catch(err => {
      console.log(err)
      return callback(err)
    })
}

function getDb() {
  return dbConnection
}

module.exports = {
  connectToDb,
  getDb
}
