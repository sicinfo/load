/**
 * application: load
 *
 * module: server.js
 *
 * o modol
 */

// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

const fs = require('fs');
const path = require('path');
const createServer = require('http').createServer;

const PWD = process.env.pm_cwd || process.env.PWD;
const HOME = process.env.HOME || PWD;
const conf = require(`${PWD}/package.json`).config;
const APPSDIRS = (arg => arg[0].startsWith('/') ? arg : path.join(arg[0].startsWith('~') ? HOME : PWD, arg))(conf.appsDirs || 'dist');
const HOST = conf.host ||  'localhost';
const PORT = conf.port || 3000;
const URL = conf.url  || 'WS';

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

  if (url[1].endsWith('unload')) {

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

    if (err) reject(res, (msg => {
      return 'ENOENT' == err.code ? msg.replace(`${APPSDIRS}/`, '') : msg;
    })(err.message));

    else if (stats.isDirectory()) {

      req.url = req.url.replace('/' + url[1], '') || '/';
      require(base)(req, res);

    } else reject(res, 'not found');

  })

}).listen(PORT, err => {
  if (err) return;

  console.log(`-------------------------------------\n${HOST}:${PORT}${APPSDIRS}\n\n\n\n\n`);
});