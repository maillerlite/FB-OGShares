require('dotenv').config();

/**
 * Module dependencies.
 */

const app = require('./index'),
  debug = require('debug')('fb-ogshares:server'),
  http = require('http');

/**
 * Get port from environment and store in Express.
 */

const http_port = normalizePort(process.env.PORT || '3000');

/**
 * Create HTTP server.
 */

const http_server = http.createServer(app.express);

/**
 * Listen on provided port, on all network interfaces.
 */

http_server.listen(http_port);
http_server.on('error', onError);
http_server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

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

  const bind = typeof port === 'string' ? 'Pipe ' + http_port : 'Port ' + http_port;

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
  const addr = http_server.address(),
    bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
