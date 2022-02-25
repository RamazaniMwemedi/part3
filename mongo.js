const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const url = `mongodb+srv://RamazaniMwemedi:${password}cluster0.t3hxb.mongodb.net/noteApp?retryWrites=true&w=majority`

// Schemas
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = new mongoose.model('Note', noteSchema)

if (process.argv.length === 3 ){
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3 ){
  const note = new Note({
    name: name,
    number: number
  })

  note.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}



console.log("Hello there");