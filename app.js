require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')
// console.log(Note);
const app = express()
const port = process.env.PORT
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const note = new Note({
  content: "Ramazani",
  date: new Date,
  import: true
})
console.log("Started");
// note.save().then(res=>{
//   console.log("Data sent to the DataBase ");
//   // mongoose.connection.close()
// })

console.log("Hello there", process.env.NAME);

// app.get('/', (req, res)=>{
//   res.send("Home page")
// })

app.get('/api/persons', (req, res) => {

//   noteSchema.set('toJSON',{
//   transform:(document, returnOdject)=>{
//     returnOdject.id= returnOdject._id.toString()
//     delete returnOdject.id
//     delete returnOdject.__v
//   }
// })

  Note.find({}).then( note=>{
    res.json(note)
  })
  console.log("API asked");
})

app.get('/notes', (req, res)=>{
  res.send(`<h1>Notes in DB</h1></br>`)
})

app.get('/info', (req, res)=>{
  Note.find({}).then( note=>{
   res.send(`<h1>Phone book has info for ${note.length} people</h1> <i>${new Date()}</i>`)
  })
  console.log("Info point asked");
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send(`<h2>Hello😎</h2> <p>You are lost here, there is no such kindd of thing here dude 😁😁😁</p>`)
  next()
  console.log("The unknown end point");
}

app.use(unknownEndpoint)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))