/****
 * module: Load
 * 
 * powered by Moreira in 2091--02-06
 * 
 * https://github.com/theturtle32/WebSocket-Node
 * 
 * typescript:
 * https://medium.com/@oieduardorabelo/typescript-o-guia-definitivo-1a63b04259cc
 ****/

 const HttpServer = function(env: any = {}) {

  const 
    { join } = require('path'), 
    { existsSync, statSync, readFileSync, realpathSync } = require('fs'), 
    { CONFIG = {} } = env,
    appsDir = realpathSync((({ appsDir = 'dist' }) => {
      switch (appsDir.slice(0, 1)) {
        case '/':
          return appsDir;
        case '~':
          return join(env?.HOME, appsDir.slice(1));
        default:
          return join(env?.pm_cwd || env?.cwd || __dirname, appsDir);
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
            dbconfig = join(env?.cwd, dbconfig);
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
    wmap = new Map();
    
  httpServer.on('request', (request, response) => {
    
    const 
      // url = (request.url.split(`${prefixDir}`)[1] || '').split('?')[0].replace(/^\/|\/$/g, '').split('/'),
       url = request.url.split('?')[0].replace(/^\/|\/$/g, '').split('/'),
      _module = (arg => arg ? `${prefixDir}-${arg}` : '')(url.shift());

    env.NODE_ENV && (({ method, url }, _date) => (({ log }) => log)(console)([
      /*'.',*/ `-> ${_date} - HTTP ${method} ${url}` /*, '-'.repeat(36 + method.length + url.length) */
    ].join('\n')))(request, new Date().toISOString());

    try {
      
      if (!_module) throw {
        'code': 'MODULE_NOT_FOUND', 
        'message': `/${_module} `
      };

      const dirname = realpathSync(join(appsDir, _module));
      if (!statSync(dirname).isDirectory()) throw {
        'code': 'MODULE_NOT_FOUND', 
        'message': `/${_module} `
      };

      const ServiceClass = require(dirname);
      wmap.has(ServiceClass) || wmap.set(ServiceClass, { dirname, dbconfig });

      const locals = wmap.get(ServiceClass);
      new ServiceClass({ url, request, response, locals });
    }
    
    catch (err) {
      response.statusCode = 500;
      response.end(`${err.code} - (${err.message})`);
    }
  });
  
  httpServer.on('listening', () => {

    const 
      { address, port } = httpServer.address(),
      node_env = (arg => arg ? ` (${arg})` : '')(env.NODE_ENV),
      lns = [
        `${new Date().toISOString()}: Listening${node_env}:`,
        `-> ${address}:${port}${appsDir}`
      ];

    console.log([
      '-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)),
      ...lns,
      '\n.'.repeat(6)
    ].join('\n'));
  });
  
  return httpServer;
};

(() => {
  const 
    teste:string = 'nome',
    { pm_cwd, HOME }: any = process.env,
    CONFIG = require(`${HOME}/etc/${pm_cwd.split('/').slice(-1)}/config_load.json`);

    console.log(teste);

  Reflect.set(CONFIG, 'appsDir', pm_cwd)
  
  HttpServer(Object.assign({}, process.env, { CONFIG, 'NODE_ENV': 'DEV' })).listen(process.env.PORT_LOAD);

})();


// console.log(109, process.env);

// if ('test' === process.env.NODE_ENV) {
//   module.exports = env => /*(console.log)(99, __filename, env) || */
//   HttpServer(Object.assign({}, process.env, env));
// }

// else {
//   const 
//     { env } = process, 
//     CONFIG = JSON.parse(env.CONFIG), 
//     { port, host } = CONFIG;
//   HttpServer(Object.assign({}, env, { CONFIG })).listen(port, host);
// }