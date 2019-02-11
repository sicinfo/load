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
  // { assign } = Object,
  { join } = require('path'), 
  { readdirSync, statSync, realpathSync, existsSync } = require('fs'),
  server = new(require('http')).Server(),
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
})();

readdirSync(appsDir, { 'encoding': 'utf8', 'flag': 'r' })
.map(filename => {
  const 
    _url = `/${filename.split('-').join('/')}`,
    _dirname = join(appsDir, filename),
    _packagejson = join(_dirname, 'package.json');
  
  return {_url, _dirname, _packagejson };
})
.filter(({ _url, _packagejson }) => {
  return _url.match(/^\/WS\/.+/) && statSync(_packagejson).isFile();
})
.map(({ _url, _dirname, _packagejson }) => {
  const 
    { name, version, main, CONFIG } = require(_packagejson);

  return { 
    name, 
    version, 
    main,
    _url, 
    _dirname, 
    'options': CONFIG
  };
})
.filter(({ _dirname, main }) => {
  return existsSync(join(_dirname, main)) && main.endsWith('.js');
})
.forEach(({ _url, _dirname, options }) => {
  _routes[_url] = { _dirname, options };
}),

server.on('request', (req, res) => {
  
  log([
    ` `,
    `-> ${new Date().toISOString()} - ${req.method} ${req.url}`,
    '-'.repeat(31 + req.method.length + req.url.length)
  ].join('\n'));
  
  const _url = req.url.split('/').slice(0, 3).join('/');

  // primeiro nível de micro serviço
  if ('function' !== typeof _routes[_url]) {
    const { options, _dirname } = _routes[_url];
    _routes[_url] = require(_dirname)(options, _dirname);
  }
  
  req.originalUrl = req.url;
  req.url = req.originalUrl.replace(_url, '');
  
  try { new _routes[_url](req, res) }
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
