var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Import the important security stuff
var jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');

// Import API documentation Swagger modules
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swaggerpet.json');


// Import Database modules
const options = require('./knexfile.js');
const knex = require('knex')(options);

// import authentication middle ware
const authenticateUser = require('./middleware/authentication.js');


// Import router stuff from other documents
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var endpointRouter = require('./routes/endpointFilters');
var searchRouter = require('./routes/search');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Activate the security functions from helmet first to protect the app
app.use(logger('common'));
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}));
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


logger.token('req', (req, res) => JSON.stringify(req.headers))
logger.token('res', (req, res) => {
  const headers = {}
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
   return JSON.stringify(headers)
 })

app.use((req, res, next) => {
  req.db = knex
  next()
})

app.use('/login', loginRouter);

app.use('/register', registerRouter);

app.use('/', endpointRouter);

app.use('/search', authenticateUser, searchRouter);

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


module.exports = app;
