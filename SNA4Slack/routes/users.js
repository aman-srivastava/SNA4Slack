const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', function(req, res, next){
   let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

   User.addUser(newUser, function(err, user){
       if(err){
           res.json({success: false, msg: 'User Registration Failed'});
       }
       else{
           res.json({success: true, msg: 'User Registration Successful'});
       }
   });
});

// Authenticate
router.post('/authenticate', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function(err, user){
       if(err) throw err;
       if(!user){
           return res.json({success: false, msg: 'User Not Found'})
       }

       User.comparePassword(password, user.password, function(err, isMatch){
           if(err)throw err;
           if(isMatch){
               const token = jwt.sign({ data: user }, config.secret, {
                   expiresIn: 604800 // 1 Week
               });
               res.json({
                  success: true,
                  token: 'JWT ' + token,
                  user: {
                      id: user._id,
                      name: user.name,
                      username: user.username,
                      email: user.email
                  }
              })
           }
           else{
               return res.json({success: false, msg: 'Wrong Password'});
           }
       });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});


module.exports = router;