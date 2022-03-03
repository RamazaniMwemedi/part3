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

  try {
    Note.find({}).then( note=>{
      const noteToSend = note.filter(n=> n.content != undefined)
      console.log(noteToSend);
      res.json(noteToSend)
  })
  console.log("API asked");
} catch (error) {
  console.error(error);
}

})

// GET single person from the db byid

app.get('/api/persons/:id', (req, res)=>{
  const id = req.params.id;
  
  Note.findById(id)
    .then(result=>{
      if(result){
        res.json(result)
      } else{
        res.status(404).end()
      }
    }
  )
    .catch(error=>{
      console.log(error);
      res.status(500).end()
    })
})

app.get('/info', (req, res)=>{
  Note.find({}).then( note=>{
   res.send(`<h1>Phone book has info for ${note.length} people</h1> <i>${new Date()}</i>`)
  })
  console.log("Info point asked");
})

// HTTP POST Request

app.post('/api/notes/', (req, res)=>{
  const body = req.body;
  if (body.content === undefined ) {
    return res.status(400).json({Error: "Body is undefined"})
    console.log(body);
  } else {
    const note = new Note({
      content: body.content,
      important: body.important,
      date: new Date()
    })

    note.save().then(result=>{
      res.json(result)
      
    })
  }
})

  // HTTP PUT Request

  app.put('/api/notes/:id',(req, res, next)=>{
    const id = req.params.id
    const body = req.body

    const note= {
      content: body.content,
      important: body.important
    }
    Note.findByIdAndUpdate(id,note)
      .then(updatedNote=>{
        res.json(updatedNote)
      })
      .catch(error=> next(error))
  })


// HTTP DELETE Request
app.delete('/api/notes/:id',(req, res, next)=>{
  Note.findByIdAndDelete(req.params.id)
    .then(result=> res.status(204).end() )
    .catch(error=> next(error))
})

app.delete('/api/note/:name',(req, res, next)=>{
  Note.remove({content: req.params.name})
    .then(result=> res.status(204))
    .catch(error=> next(error))
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send(`<h2>Hello😎</h2> <p>You are lost here, there is no such kindd of thing here dude 😁😁😁</p>`)
  next()
  console.log("The unknown end point");
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return res.status(404).send({error: "Malformated id"})
  }
  next(error)
}

app.use(errorHandler)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))