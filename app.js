const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3001

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
// app.use(requestLogger)
app.use(cors())

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res)=>{
  const theDate = new Date()
  res.send(`<h1>Phone book has info for ${persons.length} people </h1> <br/><h3>${theDate}</h3>` )
})

app.get('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id)
  const person = persons.find(person=> person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.sendStatus(404)
  }
})

app.delete('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id)
  persons = persons.filter(person=> person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res)=>{
  let body = req.body
  const name = body.name
  const important = body.important || false
  const id = Math.floor((Math.random()* 9^9999) + 1)

  const names = persons.map(person => person.name )
  const x = names.filter(useName => useName)
  
  if (x == name.toUpperCase()) {
    console.log(`This name:${name}, is found `);
    res.status(406).send('Something')
  } else{
    console.log(`${name} is not found`);
    res.status(200).send('also something')
  }
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

app.use(unknownEndpoint)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))