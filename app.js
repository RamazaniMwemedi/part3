const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

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
  const id = Math.floor((Math.random()*9999999999999999) + 1)
  const person = {
    id,
    name,
    important,
  }
  const people = persons.concat(person)
  
  res.json(people)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))