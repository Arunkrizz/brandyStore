const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const nocache=require('nocache')  
const multer = require('multer');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/admin');
const exphbs=require('express-handlebars') 

// //////////////////////////////////////////////////////////////////////
// const express = require('express');
const dotenv = require('dotenv').config();
// console.log(process.env.TWILIO_ACCOUNT_SID,"display");
const twilio = require('twilio');
/////////////////////////////////////////////////////////////////////////
// mongodb initialize
// mongoose.connectDB()


// ///////////////////////////////////////////////////////////////////////
const fileUpload=require('express-fileupload');
const connectDB = require('./config/connection');
// connectDB();
// ////////////////////////////////////////////////////////////////////////



const app = express();

// view engine setup
const hbs = exphbs.create({
	extname: '.hbs',
	defaultLayout: 'layout',
	layoutsDir: path.join(__dirname, 'views'),
	partialsDir: path.join(__dirname, './views/partials'),
	// helpers: require('./helpers/handlebarHelpers'),
	runtimeOptions: { allowProtoPropertiesByDefault: true, allowedProtoMethodsByDefault: true },
  helpers: {
    jsonStringify: function (context) {
      return JSON.stringify(context);
    }
  }
})






hbs.handlebars.registerHelper('notEqual', function (a, b) {
  return a !== b;
});
hbs.handlebars.registerHelper('equal', function (a, b) {
  return a == b;
}); 
hbs.handlebars.registerHelper('formatDate', function (date) {
  const options = { weekday: "short", month: "long", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
});
hbs.handlebars.registerHelper('gt', function (a, b) {
  return a > b;
}); 


hbs.handlebars.registerHelper('lt', function (a, b) { 
  return a < b;
}); 




// app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',hbs.engine)
app.set('view engine', 'hbs');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(nocache())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// /////////////////////////////////////////////////////////////
app.use(fileUpload())
// //////////////////////////////////////////////////////////////
app.use('/', indexRouter);
app.use('/admin', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



/**
 * Module dependencies.
 */

var debug = require('debug')('11:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


module.exports = app;
