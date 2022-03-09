require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT

// Models

const Note = require('./models/note')
const Person = require('./models/person')

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

// NOTE MODEL IN USE

// HTTP GET Requests
// GET all persons from the database
app.get('/api/notes', (req, res) => {
  try {
    Note.find({}).then( note=>{
      const noteToSend = note.filter(n=> n.content != undefined)
      console.log("Datas are sent");
      res.json(noteToSend)
  })
  console.log("API asked");
} catch (error) {
  console.error(error);
}

})

// GET single person from the db byid
app.get('/api/notes/:id', (req, res)=>{
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
// Get info on how many notes are in the Note collection
// app.get('/api/notes/info', (req, res, next)=>{
//   Note.find({})
//     .then( note=>{
//       res.send(`<h1>Phone book has info for ${note.length} people</h1> <i>${new Date()}</i>`)
//     })
//     .catch(error=> next(error))
//   console.log("Info point asked");
// })

// HTTP POST Request
app.post('/api/notes/', (req, res, next)=>{
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

    note.save()
      .then(result=>{
        res.json(result)
      })
      .catch(error=> next(error))
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
    Note.findByIdAndUpdate(id,note,{new:true, runValidators: true, context: 'query'})
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
// Deleting all datas which match the name params
app.delete('/del/notes/:name',(req, res, next)=>{
  Note.remove({content: req.params.name})
    .then(result=> res.status(204).json({messaage:`${req.params.name} has been deleted`}))
    .catch(error=> next(error))
})

// PERSON MODEL

// HTTP GET Method
// GET all persons apis

app.get('/api/persons',(req, res)=>{
  Person.find({})
    .then(person=>{
      res.json(person).status(200)
    })
})
// GET a single API
app.get('/api/persons/:id', (req, res)=>{
  Person.findById(req.params.id)
    .then(person=>{
      res.json(person).status(200)
    })
})

// HTTP POST Method
app.post('/api/persons',(req, res)=>{
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
    important: body.important,
    date: new Date()

  })
  person.save()
    .then(person=>{
      res.json(person)
    })

})
// HTTTP PUT method
app.put('/api/persons/:id', (req, res)=>{
  const id = req.params.id
  const person = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findByIdAndUpdate(id, person)
    .then(updatedPerson=>{
      res.json(updatedPerson)
    })
    .catch(error=> {
      console.log(error);
      next(error)})
})
// HTTP DELETE method 
app.delete('/api/persons/:id',(req, res)=>{
  Person.findByIdAndDelete(req.params.id)
    .then(result=> res.status(204).end() )
    .catch(error=> next(error))
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send(`<h2>Hello😎</h2> <p>You are lost here, there is no such kindd of thing here dude 😁😁😁</p> <a href="/" >Home<a>`)
  next()
  console.log("The unknown end point");
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return res.status(404).send({error: "Malformated id"})
  } else if(error.name === 'ValidationError'){
    return res.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))