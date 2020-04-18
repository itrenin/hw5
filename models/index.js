const mongoose = require('mongoose')
const Person = require('./models/person')
const Auto = require('./models/auto')
//const Schema = mongoose.Schema

mongoose.Promise = global.Promise

//mongoose.connect('mongodb://localhost:27017/persondb')
mongoose.connect(
  'mongodb+srv://itrenin:lofthw5@cluster0-aak0t.mongodb.net/test?retryWrites=true&w=majority'
)

// const Person = mongoose.model('person', personScheme)
// const user = new Person({
//   name: 'Толик',
//   age: 41,
// })

// user
//   .save()
// Person.create({
//   name: 'Сережа',
//   age: 35,
// })
Auto.create({
  name: 'Lada',
  model: 'Vesta',
  body: 'sedan',
  engine: 'gasoline',
})
  .then(function (doc) {
    console.log(`Сохранен объект ${doc}`)
    mongoose.disconnect()
  })
  .catch(function (err) {
    console.error(err)
    mongoose.disconnect()
  })

// Person.find({ name: 'Толик' }, 'name age', function (err, person) {
//   if (err) {
//     return console.log(err)
//   }
//   console.log(person)
//   mongoose.disconnect()
// })

// Person.findById('5e960d1a46017c3f78987dc9', function (err, person) {
//   if (err) {
//     return console.log(err)
//   }
//   console.log(person)
//   mongoose.disconnect()
// })

// Person.findByIdAndDelete('5e960d1a46017c3f78987dc9', function (err, person) {
//   if (err) {
//     return console.log(err)
//   }
//   console.log(person)
//   mongoose.disconnect()
// })
