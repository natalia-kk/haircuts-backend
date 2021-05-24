const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')

// schema
const haircutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String    
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    // refers to the user model - tells Mongoose to refer to the user model. = an actual user document in the database
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User' 
  },
  image: {
    type: String,
    required: true    
  },
  gender: {
    type: String,
    required: true
  },
  length: {
    type: String,
    required: true
  }
  
}, { timestamps: true })


// model
const haircutModel = mongoose.model('Haircut', haircutSchema)

// export
module.exports = haircutModel
