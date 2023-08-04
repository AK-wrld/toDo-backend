const express = require('express')
const { body, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const fetchuser = require('../middlewares/fetchuser')
const jwt = require('jsonwebtoken');

//Create a new user
router.post('/createUser',[
    body('username','Enter a valid username').isLength({ min: 1 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 }),
    
],async (req,res)=> {
    const errors = validationResult(req);
  
    
    if (!errors.isEmpty()) {
      return res.status(400).json({success:false, errors: errors.array() });
    }
    try {

     
      let user = await User.findOne({email: req.body.email})
      if(user) {
        return res.status(400).json({success:false,error:"Sorry this email already exists"})
      }
      let anotherUser = await User.findOne({username: req.body.username})
      if(anotherUser) {
        return res.status(400).json({success:false,error:"Sorry this username already exists"})
      }
      
    
      var salt = await bcrypt.genSaltSync(10);
      var securedPass = await bcrypt.hash(req.body.password,salt)
      
       user = await User.create({
          username: req.body.username,
          email: req.body.email,
          password: securedPass,
          address: req.body.address,
         
        })

       
        var data = {
          user: {
            id: user.id
          }
        }
        const authToken = jwt.sign(data,process.env.JWT_Secret) //this will 
        res.json({success:true,authToken:authToken})
          
     
    }
    catch {
      
      res.status(500).json({success:false,error:"Internal server error"})
    }
})


//Login Endpoint
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be left blank').exists(),
  
],async (req,res)=> {
  // console.log(req.body)
  const errors = validationResult(req.body);
 
  if (!errors.isEmpty()) {
    return res.status(400).json({success:false, errors: errors.array() });
  }
  let {email,password}=req.body

  try {
   
    let user = await User.findOne({email: email})
    if(!user) {
      return res.status(400).json({success:false,error:"Please enter a valid email"})
    }
    
      let passCompare = await bcrypt.compare(password,user.password)
     
      if(!passCompare) {
      return res.status(400).json({success:false,error:"Password does not match the email.Either check your password or email"})

      }
      else {
        var data = {
          user: {
            id: user.id
            
          }
        }
        const authToken = jwt.sign(data,process.env.JWT_Secret) 
        res.json({success:true,authToken:authToken})
      
    }
  } catch {
    
      res.status(500).json({success:false,error:"Internal server error"})
  }
})


//Fetching an existing logged in user details from auth token
router.post('/getuser',fetchuser,async(req,res)=> {
  try {
    let userId = req.user.id
    // console.log(userId)
    const user = await User.findById(userId).select("-password")
    res.json({success:true,user})
  } catch {
    
      res.status(500).json({success:false,error:"Internal server error"})
  }
})
module.exports = router