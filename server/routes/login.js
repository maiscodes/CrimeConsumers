var jwt = require('jsonwebtoken');
var express = require('express');
var secret = require('../jwt/secret');
var bcrypt = require('bcrypt');
const mysql = require('mysql');
var router = express.Router();

router.post("/",function(req,res, next){
  var email = req.body.email;
  var password = req.body.password;

  req.db.from('users').select('id','password').where('email', email)//insert({email: email, password: password}).into('users')
  .then((rows) => {
    console.log(rows);

    if (rows.length === 1) {
      console.log("user exists");
      try {
        bcrypt.compare(password, rows[0]["password"], function(err, isMatch) {
          if (isMatch) {

            // Create the JWT token
            var token = jwt.sign({ id: rows[0]["id"] },
              secret.secret,
              { expiresIn: 86400
              });

            console.log(token);
            res.status(200).json({"access_token": token,
            "token_type": "Bearer",
            "expires_in": 86400})
            return;
          }
          else{
            console.log(err);
            res.status(401).json({"message": "invalid login - bad password"})
            return;
          }
        });
      }

      catch {
        console.log(err);
        res.status(401).json({"message": "invalid login - bad password"})
        return;
      }
    }
    else {
      res.status(401).json({"message": "invalid login - bad password"})
      return;
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(401).json({"message": "invalid login - bad password"})
  })

});

module.exports = router;
