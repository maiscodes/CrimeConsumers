var jwt = require('jsonwebtoken');
var express = require('express');
var secret = require('../jwt/secret');
const mysql = require('mysql');
var router = express.Router();

function createFilter(filterName, filterValues, addToFilters) {
  var filterObj = {name: filterName, values: filterValues };
  addToFilters(filterObj);
}

function processFilterNumbers(filterName, numString, addToFilters) {
  var stringArray = numString.split(",");
  var numArray = [];
  for (var n = 0; n < stringArray.length; n++) {
    numArray.push(parseInt(stringArray[n], 10));
  }
  createFilter(filterName, numArray, addToFilters);
}

function processFilterNames(filterName, numString, addToFilters) {
  var stringArray = numString.split(",");
  createFilter(filterName, stringArray, addToFilters);
}

function addToQuery(req, currentQuery, additionalFilters, updateQuery) {
  var newQuery = req.db.select().from(currentQuery).as(additionalFilters["name"]).whereIn(additionalFilters["name"], additionalFilters["values"]);
  updateQuery(newQuery);
}

function getSumOffences(req, offenceId, prevQuery, updateQuery) {
  var newQuery = req.db.select({LGA: 'area'}).sum({total: offenceId}).from(prevQuery).as("oPerLGA").groupBy('area');
  var showLatLngQuery = req.db.select({LGA: 'oPerLGA.LGA'}, {total: 'oPerLGA.total'}, {lat: 'areas.lat'}, {lng: 'areas.lng'}).from(newQuery).leftJoin('areas', 'oPerLGA.LGA', 'areas.area');
  updateQuery(showLatLngQuery);
}

router.get("/",function(req, res, next){

    var filters = [];

    if (req.query.area != undefined) {
      processFilterNames("area", req.query.area, function addToFilters(filterObj) { filters.push(filterObj);});
    }

    if (req.query.age != undefined) {
      processFilterNames("age", req.query.age, function addToFilters(filterObj) { filters.push(filterObj);});
    }

    if (req.query.gender != undefined) {
      processFilterNames("gender", req.query.gender, function addToFilters(filterObj) { filters.push(filterObj);});
    }

    if (req.query.year != undefined) {
      console.log('process years');
      console.log(req.query.year);
      processFilterNumbers("year", req.query.year, function addToFilters(filterObj) { filters.push(filterObj);});
    }

    if (req.query.month != undefined) {
      processFilterNumbers("month", req.query.month, function addToFilters(filterObj) { filters.push(filterObj);});
    }

    var currentQuery;
    var resQuery = {};

    if (filters.length === 0) {
      var offenceId = "";
      req.db.select("column").from('offence_columns').where('pretty', req.query.offence)
      .then((rows) => {
        offenceId = rows[0]["column"];
        currentQuery = req.db.select().from('offences').as('t1');
        getSumOffences(req, offenceId, currentQuery,
          function updateQuery(newQuery) {
            currentQuery = newQuery;
            currentQuery
             .then((rows) => {
               resQuery = {"offence": req.query.offence};
               res.status(200).json({"query": resQuery, "result": rows});
             })
             .catch((err) => {
               console.log(err);
               res.status(500).json({
  "error": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "message": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "e": {}
})
             })});
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
  "error": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "message": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "e": {}
})
      })
      return;
    }

    currentQuery = req.db.select().from('offences').as('t1').whereIn(filters[0]["name"], filters[0]["values"]);
    resQuery[filters[0]["name"]] = filters[0]["values"];

    for (var f = 0; f < filters.length; f++) {
      addToQuery(req, currentQuery, filters[f], function updateQuery(newQuery) {currentQuery = newQuery;})

      resQuery[filters[f]["name"]] = filters[f]["values"];

      if (f == filters.length - 1) {
        console.log(currentQuery.toSQL());
        resQuery["offence"] = req.query.offence;

          var offenceId = "";
          req.db.select("column").from('offence_columns').where('pretty', req.query.offence)
          .then((rows) => {

            offenceId = rows[0]["column"];
            getSumOffences(req, offenceId, currentQuery,
              function updateQuery(newQuery) {
                currentQuery = newQuery;
                currentQuery
                 .then((rows) => {

                   res.status(200).json({"query": resQuery, "result": rows});

                 })
                 .catch((err) => {
                   console.log(err);
                   res.status(500).json({
  "error": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "message": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "e": {}
})
                 })});
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
  "error": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "message": "oh no! It looks like there was a database error while performing your search, give it another try...",
  "e": {}
})
          })

      }
    }

});


module.exports = router;
