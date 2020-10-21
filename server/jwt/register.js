var express = require('express');
var bcrypt = require('bcrypt');
const mysql = require('mysql');
var router = express.Router();

router.post("/register",function(req,res, next){
  var email = req.body.email;
  var password;

  bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
      if (err) {
        return;
      }

      password = hashedPassword;

      req.db.insert({email: email, password: password}).into('users')
      .then((rows) => {
        res.status(201).json({"message": "yay! you've successfully registered your user account :)"
         });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({"message": "oops! It looks like that user already exists :("});
      })

  });

});

module.exports = router;
