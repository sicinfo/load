/****
 * module: Load
 * 
 * powered by Moreira in 2091--02-06
 * 
 * https://github.com/theturtle32/WebSocket-Node
 ****/

const HttpServer = function(env) {
  
  const 
    { join } = require('path'), 
    { existsSync, statSync, readFileSync, realpathSync } = require('fs'), 
    { CONFIG = {} } = env,
    appsDir = realpathSync((({ appsDir = 'dist' }) => {
      switch (appsDir.slice(0, 1)) {
        case '/':
          return appsDir;
        case '~':
          return join(env.HOME, appsDir.slice(1));
        default:
          return join(env.pm_cwd || env.cwd || __dirname, appsDir);
      }
    })(CONFIG)),
    dbconfig = (({ dbconfig = {} }) => {
      if ('string' === typeof(dbconfig)) {
        switch (dbconfig.slice(0, 1)) {
          case '/':
            break;
          case '~':
            dbconfig = join(env.HOME, dbconfig.slice(1));
            break;
          default:
            dbconfig = join(env.cwd, dbconfig);
        }
        if (!(existsSync(dbconfig) && statSync(dbconfig).isFile())) dbconfig = {};
      }
      if ('object' !== typeof(dbconfig)) {
        try { dbconfig = JSON.parse(readFileSync(dbconfig).toString()) }
        catch (err) { dbconfig = {} }
      }
      return dbconfig;
    })(CONFIG),
    { prefixDir = 'WS' } = CONFIG,
    httpServer = require('http').createServer(),
    Auth = require('./auth'),
    wmap = new WeakMap();
    
  httpServer.on('request', (_request, _response) => {

    const
      url = (_request.url.split(`${prefixDir}`)[1] || '').split('?')[0].replace(/^\/|\/$/g, '').split('/'),
      _module = (arg => arg ? `${prefixDir}-${arg}` : '')(url.shift());
      
    env.NODE_ENV && (({ method, url }, _date) => (({ log }) => log)(console)([
      /*'.',*/ `-> ${_date} - HTTP ${method} ${url}` /*, '-'.repeat(36 + method.length + url.length) */
    ].join('\n')))(_request, new Date().toISOString());

    try {
      
      if (!_module) throw {'code': 'MODULE_NOT_FOUND', 'message': `/${_module} `};
      const dirname = realpathSync(join(appsDir, _module)); 

      if (!statSync(dirname).isDirectory()) throw {'code': 'MODULE_NOT_FOUND', 'message': `/${_module} `};
      const ServiceClass = require(dirname);
      wmap.has(ServiceClass) || wmap.set(ServiceClass, { dirname, dbconfig });
      
      (cb => Auth.verify(_request.headers)
        .then(({ token }) => cb(token)).catch(({ message }) => cb({ 'error': message }))
      )(_authorization => (Service => {
        new Service({ url });
      })(class extends ServiceClass {
        get authorization() { return _authorization }
        get request() { return _request }
        get response() { return _response }
        get locals() { return wmap.get(ServiceClass) }
      }));        
    }
    
    catch (err) {
      _response.statusCode = 500;
      _response.end(`${err.code} - (${err.message})`);
    }
  });
  
  httpServer.on('listening', () => {
    const 
      {address, port } = httpServer.address(),
      node_env = (arg => arg ? ` (${arg})` : '')(env.NODE_ENV),
      lns = [
        `${new Date().toISOString()}: Listening${node_env}:`,
        `-> ${address}:${port}${appsDir}`
      ];
      
    (({ log }) => log)(console)([
      '-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)),
      ...lns,
      '\n.'.repeat(6)
    ].join('\n'));
  });
  
  return httpServer;
};

if ('test' === process.env.NODE_ENV) {
  module.exports = env => /*(console.log)(99, __filename, env) || */
  HttpServer(Object.assign({}, process.env, env));
}

else {
  const 
    { env } = process, 
    CONFIG = JSON.parse(env.CONFIG), 
    { port, host } = CONFIG;
  HttpServer(Object.assign({}, env, { CONFIG })).listen(port, host);
}