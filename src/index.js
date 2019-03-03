/**
 * module: Load
 * 
 * powered by Moreira in 2091--02-06
 */
'use strict';

const { log, warn } = console;
log([
  '\n.'.repeat(3),
  `Starting server`,
  `-> ${new Date().toISOString()}`,
  `-> ${__filename}`,
  '-'.repeat(3 + Math.max(24, __filename.length))
].join('\n'));

const 
  { join } = require('path'), 
  { readFileSync, statSync, realpathSync, existsSync } = require('fs'),
  
  server = new(require('http')).Server(),
  
  // leitura do package.json do pm2
  { host, port, appsDir, _routes = {} } = (() => {

    let {
      host = 'localhost',
        port = 3000,
        appsDir = 'dist'
    } = JSON.parse(process.env.CONFIG || '{}');

    switch (appsDir.slice(0, 1)) {
      case '/':
        break;
      case '~':
        appsDir = join(process.env.HOME, appsDir.slice(1));
        break;
      default:
        appsDir = join(process.env.cwd, appsDir);
    }

    return { host, port, 'appsDir': realpathSync(appsDir) };
  })(),

  notfound = (res, url) => {
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ 'message': `${url} - not found!` }));
  },
  
  symb = Symbol();
  
server.on('request', (req, res) => {
  
  log([
    ` `,
    `-> ${new Date().toISOString()} - ${req.method} ${req.url}`,
    '-'.repeat(31 + req.method.length + req.url.length)
  ].join('\n'));
  
  // primeiro nível de micro serviço
  const _url = req.url.split('/').slice(0, 3).join('/');
  if ('function' !== typeof _routes[_url]) {
    
    const 
      _dirname = join(appsDir, _url.slice(1).replace('/', '-')),
      packagejson = join(_dirname, 'package.json');
    
    if (existsSync(packagejson) && statSync(packagejson).isFile()) {
      
      const 
        { main, version, CONFIG } = JSON.parse(readFileSync(packagejson)),
        dirname = realpathSync(_dirname);
            
      if (existsSync(join(dirname, main)) && main.endsWith('.js')) {
        _routes[_url] = { 'config': Object.assign({ version, dirname }, CONFIG) };
        _routes[_url][symb] = require(dirname);
      }
      
      else return notfound(res, _url);
    }
    
    else return notfound(res, _url);
  }
  
  req.originalUrl = req.url;
  req.url = req.originalUrl.replace(_url, '');
  
  try { new _routes[_url][symb](req, res, _routes[_url]['config']) }
  catch (err) { warn(err) }
  
});

server.on('listening', () => {

  log([
    `Listening:`,
    `-> ${host}:${port}${appsDir}`,
    '-'.repeat(4 + host.length + `${port}`.length + appsDir.length),
    '\n.'.repeat(6)
  ].join('\n'));
  
});

server.listen({host, port});
