/**
 * module: Load
 * 
 * powered by Moreira in 2091--02-06
 * 
 * https://github.com/theturtle32/WebSocket-Node
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
  
  // leitura do package.json do pm2
  { host, port, appsDir } = (() => {

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
  
  _routes = {},
  symb = Symbol(),

  service = ({ originalUrl, method = '', done }) => {
    
    log([
      ` `,
      `-> ${new Date().toISOString()} - ${method} ${originalUrl}`,
      '-'.repeat(31 + method.length + originalUrl.length)
    ].join('\n'));
    
    // primeiro nível de micro serviço
    const url = originalUrl.split('/').slice(0, 3).join('/');
    if ('function' !== typeof _routes[url]) {
      
      const 
        _dirname = join(appsDir, url.slice(1).replace('/', '-')),
        packagejson = join(_dirname, 'package.json');


      if (existsSync(packagejson) && statSync(packagejson).isFile()) {

        const 
          { main, version, CONFIG } = JSON.parse(readFileSync(packagejson)),
          dirname = realpathSync(_dirname);
              
        if (existsSync(join(dirname, main)) && main.endsWith('.js')) {
          _routes[url][symb] = require(dirname);
          _routes[url][symb][symb] = Object.assign({ version, dirname }, CONFIG);
        }
        
        else return done(undefined, url);
      }
      
      else return done(undefined, url);
    }
    
    try { 
      
      done(
        _routes[url][symb],  // classe de Router
        Object.assign({}, _routes[url][symb][symb], { originalUrl, 'url': originalUrl.replace(url, '') })
      );
    }
    catch (err) { warn(err) }
    
  },
  
  notfound = (res, url) => {
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ 'message': `${url} - not found!` }));
  },
  
  httpServer = require('http').createServer(),
  wsServer = new(require('websocket')).server({ httpServer });

httpServer.on('request', (req, res) => {
  
  service({
    'originalUrl': req.url, 
    'method': req.method, 
    'done': (Route, options) => {
      if (!Route) return notfound(res, options.url);
      new Route({ req, res, options });
    }
  });
  
});

wsServer.on('request', ({ resourceURL, origin, accept }) => {
  
  const connection = accept('echo-protocol', origin);
    
  log(`${new Date()} Connection accepted.`);
  
  service({
    'originalUrl': resourceURL.pathname,
    'done': (Route, options) => {
      new Route({ connection, options });
    }
  });

});

httpServer.on('listening', () => {

  log([
    `Listening:`,
    `-> ${host}:${port}${appsDir}`,
    '-'.repeat(4 + host.length + `${port}`.length + appsDir.length),
    '\n.'.repeat(6)
  ].join('\n'));
  
});

httpServer.listen({'host':'0.0.0.0', port});
