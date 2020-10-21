const mysql = require('mysql');

//sepcify all the information requred to connect to a specific database
const connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'root',
       password : 'Secret',
       database : 'world'
});

connection.connect(function(err) {
         if (err) throw err;
       });

// now export the connection so can be used in app etc
module.exports = (req, res, next) => {
  req.db = connection;
  next()
}
