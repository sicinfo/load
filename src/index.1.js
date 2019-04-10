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
  ws = require('ws'),
  
  server = new(require('http')).Server(),
  
  serws = new ws.Server({server}),
  
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
  
  service = (url, method, done) => {
    
    log([
      ` `,
      `-> ${new Date().toISOString()} - ${method} ${url}`,
      '-'.repeat(31 + method.length + url.length)
    ].join('\n'));
    
    // primeiro nível de micro serviço
    const _url = url.split('/').slice(0, 3).join('/');
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
        
        else return done(undefined, _url);
      }
      
      else return done(undefined, _url);
    }
    
    try { 
      done(
        _routes[_url][symb], // classe de serviço
        url.replace(_url, ''), // nova url
        _routes[_url]['config'] // options de package.json
      );
    }
    catch (err) { warn(err) }
    
  },
  
  symb = Symbol();
  
  
  
server.on('request', (req, res) => {
  
  service(req.url, req.method, (route, url, options) => {
    
    if (!route) return notfound(res, url);
    
    req.originalUrl = req.url;
    req.url = url;
    
    new route(req, res, options);
    
  });
  
});
  
server.on('u_pgrade',  (req, socket, head) => {
  
  log(158);
  
  service(req.url, req.method, (route, url, options) => {
    
    if (!route) return;
  
    req.originalUrl = req.url;
    req.url = url;
    req.head = head;
  
    new route(req, socket, options);
    
  });

});

serws.on('connection', client => {
  
  log(137, client);
  
  let count = 0;
  

  client.on('message', arg => {
    
    log(`message ${arg}`);
    
  });
  
  setInterval(() => {
    client.send(`teste - ${count++}`);
  }, 1500);
  
});


server.on('listening', () => {

  log([
    `Listening:`,
    `-> ${host}:${port}${appsDir}`,
    '-'.repeat(4 + host.length + `${port}`.length + appsDir.length),
    '\n.'.repeat(6)
  ].join('\n'));
  
});

// server.listen({host, port});
server.listen({'host': '0.0.0.0', port});
