/**
 * application: load
 *
 * module: server.js
 * [0.0.4]
 *
 * [2018-01-25] 
 * - passa parametros para chamadas 
 */

// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

const { stat } = require('fs');
const { join } = require('path');
const { createServer } = require('http');

const options = ((pwd, home, appsDirs, host, port, url) => {
  
  // console.log(pwd);
  // console.log(home);
  // console.log(appsDirs);
  // console.log(host);
  // console.log(port);
  // console.log(url);
  
  home || (home = pwd);
  
  const opts = Object.assign({pwd, home, appsDirs, host, port, url}, require(`${pwd}/package.json`).config);
  
  opts.appsDirs.startsWith('/') || (
    opts.appsDirs = join(opts.appsDirs.startsWith('~') ? home : pwd, opts.appsDirs)
  );
  
  // console.log(opts);
  
  return opts;
})(process.env.pm_cwd || process.env.PWD, process.env.HOME, 'dist', 'localhost', 3000, 'WS');

const reject = (res, msg = null, code = 404) => {
  res.writeHead(
    code, {
      'Content-Type': 'text/plain;charset=utf8'
    }
  );
  res.end(msg);
};

createServer((req, res) => {

  // console.log(`${req.method} - ${req.headers.origin}`);

  const url = [req.headers.host.split('.')[0]].concat(req.url.split('/').slice(1));

  // console.log(url);
  // console.log(req.method);

  if (url.length < 3) return reject(res);

  if ('unload' === url[2]) {

    const msg = ['unload:'];

    Object.keys(require.cache).filter((k, i) => i).forEach((k, i) => {
      msg.push('' + (i + 1) + ' - ' + k);
      delete require.cache[k];
    });

    reject(res, msg.join('\n') + '\n', 200);

    return;
  }
  
  const base = join(options.appsDirs, `${url[1]}_${url[0]}`);
  
  // console.log(base);

  stat(base, (err, stats) => {

    if (err) reject(res, (msg => {
      return 'ENOENT' === err.code ? msg.replace(`${options.appsDirs}/${url[1]}_`, '') : msg;
    })(err.message));

    else if (stats.isDirectory()) {

      req.url = `/${url.slice(2).join('/')}`;

      // console.log(options);
      // console.log(req.url);

      res.local = {options};

      require(base)(req, res);

    } 
    
    else reject(res, 'not found');

  });

}).listen(options.port, err => {
  if (err) return;
  console.log(`-------------------------------------\n${options.host}:${options.port}${options.appsDirs}\n\n\n\n\n`);
});
