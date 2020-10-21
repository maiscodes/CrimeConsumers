var express = require('express');
const mysql = require('mysql');
var router = express.Router();

router.get("/offences",function(req,res, next){
  req.db.from('offence_columns').select('pretty')
  .then((rows) => {
    var offences = [];
    for (var r = 0; r < rows.length; r++) {
      offences.push(rows[r].pretty);
    }
    res.json({"offences" : offences})
  })
  .catch((err) => {
    console.log(err);
    res.json({"Error" : true, "Message" : "Error executing MySQL query"})
  })
});

router.get("/areas",function(req,res, next){
  req.db.from('areas').select('area')
  .then((rows) => {
    var areas = [];
    for (var r = 0; r < rows.length; r++) {
      areas.push(rows[r].area);
    }
    res.json({"areas" : areas})
  })
  .catch((err) => {
    console.log(err);
    res.json({"Error" : true, "Message" : "Error executing MySQL query"})
  })
});

router.get("/ages",function(req,res, next){
  req.db.from('offences').distinct('age')
  .then((rows) => {
    var ages = [];
    for (var r = 0; r < rows.length; r++) {
      ages.push(rows[r].age);
    }
    res.json({"ages" : ages})
  })
  .catch((err) => {
    console.log(err);
    res.json({"Error" : true, "Message" : "Error executing MySQL query"})
  })
});

router.get("/genders",function(req,res, next){
  req.db.from('offences').distinct('gender')
  .then((rows) => {
    var genders = [];
    for (var r = 0; r < rows.length; r++) {
      genders.push(rows[r].gender);
    }
    res.json({"genders" : genders})
  })
  .catch((err) => {
    console.log(err);
    res.json({"Error" : true, "Message" : "Error executing MySQL query"})
  })
});


router.get("/years",function(req,res, next){
  req.db.from('offences').distinct('year')
  .then((rows) => {
    var years = [];
    for (var r = 0; r < rows.length; r++) {
      years.push(rows[r].year);
    }
    res.json({"years" : years})
  })
  .catch((err) => {
    console.log(err);
    res.json({"Error" : true, "Message" : "Error executing MySQL query"})
  })
});

module.exports = router;
