const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Haircut = require('./../models/Haircut')
const path = require('path')

// GET- get all haircuts ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Haircut.find().populate('user', '_id firstName lastName') // populate: calls ref:user in haircuts model, brings in firstName and lastName from user object
    .then(haircuts => {
      if(haircuts == null){
        return res.status(404).json({
          message: "No haircuts found"
        })
      }
      res.json(haircuts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting haircuts"
      })
    })  
})

// POST - create new haircut --------------------------------------
// anytime someone goes to /haircut route with a post request
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Haircut content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Image can't be empty"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new haircut
  let uploadPath = path.join(__dirname, '..', 'public', 'images') // path - comes with node.js - but we need to import it
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    // callback function runs once file is uploaded
    // create new haircut
    let newHaircut = new Haircut({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      user: req.body.user,
      image: uniqueFilename,
      gender: req.body.gender,
      length: req.body.length
    })
  
    newHaircut.save() // save new haircut to database
    .then(haircut => {        
      // success!  
      // return 201 status with haircut object
      return res.status(201).json(haircut)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating haircut",
        error: err
      })
    })
  })
})

// export
module.exports = router