var jwt = require('jsonwebtoken');
var express = require('express');
var secret = require('../jwt/secret');

function checkAuthorisationExists(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).json({"message": "oops! it looks like you're missing the authorization header"
     });
     return;
  }
  next();
}

function checkOffenceExists(req, res, next) {
  if (!req.query.offence) {
     res.status(400).json({"message": "oops! it looks like you're missing the offence query parm"
      });
      return;
  }
  next();
}

function checkValidJWT(req, res, next) {
  messyToken = req.headers.authorization.split(" ");
  var token = messyToken[1];
  console.log(token);

  jwt.verify(token, secret.secret, function(err, decoded) {
    if (err) {
      res.status(401).json({ "message": "oh no! it looks like your authorization token is invalid..." });
      return;
    }
    else {
        next();
    }
  });

}

const authenticateUser = [checkAuthorisationExists, checkOffenceExists, checkValidJWT];

module.exports = authenticateUser;
