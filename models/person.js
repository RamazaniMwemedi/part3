const mongoose = require('mongoose')

const url = process.env.MONGODB_URI_PERSON

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
      name: {
        type:String,
        minLength: 6,
        required: true
      },
      number: {
        type: Number,
        minLength:10,
        required: true
      },
      important: Boolean,
      date : Date
  })

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)