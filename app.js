var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config'); 

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const restaurantRouter = require('./routes/restaurants');

// Create Express app FIRST
var app = express();

// Connect to MongoDB
mongoose.connect(config.db)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Database connection error: ", err));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers after creating app
app.use('/restaurants', restaurantRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Swagger/OpenAPI setup
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('SwaggerUI available at http://localhost:3000/api-docs');

// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
