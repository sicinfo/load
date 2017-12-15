/**
 * application: load
 *
 * module: server.js
 *
 */

// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

const fs = require('fs');
const path = require('path');
const createServer = require('http').createServer;

const APPSDIRS = (function(arg) {
  '/' == arg[0] || (arg = path.join(process.env.PWD || process.env.HOME, arg))
  return arg;
}(process.env.npm_package_config_appsDirs || 'dist'));
const HOST = process.env.npm_package_config_host ||  'localhost';
const PORT = process.env.npm_package_config_port || 3000;
const URL = process.env.npm_package_config_url || 'WS';

const reject = (res, msg = null, code = 404) => {
  res.writeHead(
    code, {
      'Content-Type': 'text/plain;charset=utf8'
    }
  );
  res.end(msg);
};

createServer((req, res) => {

  const url = req.url.split('/');
  if (url.length < 2) return reject(res);

  if ('unload' == url[1]) {

    let msg = ['unload:'];

    Object.keys(require.cache).filter((k, i) => i).forEach((k, i) => {
      msg.push('' + (i + 1) + ' - ' + k);
      delete require.cache[k]
    });

    reject(res, msg.join('\n') + '\n', 200);

    return;
  }

  const base = path.join(APPSDIRS, url[1]);

  fs.stat(base, (err, stats) => {

    if (err) reject(res, err.message);

    else if (stats.isDirectory()) {

      console.log(__filename, req.url, req.url.replace('/' + url[1], ''));

      req.url = req.url.replace('/' + url[1], '') || '/';
      require(base)(req, res);

    } else reject(res, 'not found');

  })

}).listen(PORT, err => {

  if (err) return;

  console.log(
    '-------------------------------------\n',
    HOST + ':' + PORT + APPSDIRS, '\n\n\n\n\n'
  );

});