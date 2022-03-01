require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')
const morgan = require('morgan')
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
app.use(morgan('dev'))

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

console.log("Hello there", process.env.NAME);

// HTTP GET Requests

// GET all persons from the database

app.get('/api/persons', (req, res) => {
  Note.find({}).then( note=>{
    res.json(note)
  })
  console.log("API asked");
})

// GET single person from the db byid

app.get('/api/persons/:id', (req, res)=>{
  const id = req.params.id;
  
  Note.findById(id).then(result=>{
    res.json(result)
    console.log(`${result.content} was been fetched`)
  })
})

app.get('/info', (req, res)=>{
  Note.find({}).then( note=>{
   res.send(`<h1>Phone book has info for ${note.length} people</h1> <i>${new Date()}</i>`)
  })
  console.log("Info point asked");
})

// HTTP POST Request

app.post('/api/notes/:id', (req, res)=>{
  const body = req.body;
  if (body.content === undefined ) {
    return res.status(400).json({Error: "Body is undefined"})
    console.log(body);
  }
  const note = new Note({
    content: body.content,
    important: body.important,
    date: new Date()
  })

  note.save().then(result=>{
    res.json(result)
    
  })
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send(`<h2>Hello😎</h2> <p>You are lost here, there is no such kindd of thing here dude 😁😁😁</p>`)
  next()
  console.log("The unknown end point");
}

app.use(unknownEndpoint)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))