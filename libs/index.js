/****
 * module: Load
 * 
 * powered by Moreira in 2091--02-06
 * 
 * https://github.com/theturtle32/WebSocket-Node
 ****/

const 
  { log, warn } = console, 
  { join } = require('path'), 
  { existsSync, statSync, realpathSync, readFileSync } = require('fs'),
  { NODE_ENV } = process.env;

log([
  '\n.'.repeat(3),
  `Starting server..`,
  `-> ${new Date().toISOString()}`,
  `-> ${__filename}`,
  '-'.repeat(3 + Math.max(24, __filename.length))
].join('\n'));

module.exports = function(arg) {

  const 
    { host, port, appsDir, dbconfig } = (env => {
      
      // leitura da atributo CONFIG do arquivos package.json 
      // iniciado pelo pm2.
      let {
        host = 'localhost',
        port = 3000,
        appsDir = 'dist',
        dbconfig = {}
      } = JSON.parse(env.CONFIG || '{}');
      
      dbconfig = (arg => {
        
        if ('object' === typeof(arg)) return arg;
  
        if ('string' === typeof(arg)) {
          switch (arg.slice(0, 1)) {
            case '/':
            break;
          case '~':
            arg = join(env.HOME, arg.slice(1));
            break;
          default:
            arg = join(env.cwd, arg);
          }
          if (!(existsSync(arg) && statSync(arg).isFile())) return {};
        }
  
        try { return JSON.parse(readFileSync(arg).toString()) }
        catch (err) { return {} }
                
      })(dbconfig);
      
      switch (appsDir.slice(0, 1)) {
      case '/':
        break;
      case '~':
        appsDir = join(env.HOME, appsDir.slice(1));
        break;
      default:
        appsDir = join(env.cwd, appsDir);
      }
  
      return { host, port, appsDir, dbconfig };
  
    })(Object.assign({}, process.env, arg)),
  
    _cache = {},
    makeRoute = options => new Promise((accept, reject) => {
      
      const 
        { protocol } = options,
        { method } = options.request,
        originalUrl = options.request.url,
        routeName = originalUrl.split('/').slice(0, 3).join('/'),
        routers = _cache[protocol] || (_cache[protocol] = {});

      NODE_ENV === 'dev' || log([
        ` `,
        `-> ${new Date().toISOString()} - ${protocol} ${method} ${originalUrl}`,
        '-'.repeat(32 + method.length + originalUrl.length + protocol.toString().length)
      ].join('\n'));
      
      // cache first level micro service
      if (!routers[routeName]) {
        
        const 
          dirname = join(appsDir, routeName.slice(1).replace('/', '-')),
          packagejson = join(dirname, 'package.json');
          
        if (!(existsSync(packagejson) && statSync(packagejson).isFile())) {
          const error = Object.assign({ 'message': 'package.json' }, options);
          reject(error);
          return NODE_ENV === 'dev' && error;
        }
        
        const { main, version } = JSON.parse(readFileSync(packagejson).toString());
        
        if (!(existsSync(join(dirname, main)) && main.endsWith('.js'))) {
          const error = Object.assign({ 'message': 'main: <executable.js>' }, options);
          reject(error);
          return NODE_ENV === 'dev' && error;
        }
        
        routers[routeName] = [
          require(join(dirname, main)),
          { version, 'appname': routeName.slice(1).split('/')[1], 'dirname': realpathSync(dirname) }
        ];
      }
      try { 
        accept({ 
          'router': routers[routeName][0],
          'options': Object.assign({}, routers[routeName][1], options, { 'url': originalUrl.replace(routeName, '') })
        });
        if (NODE_ENV === 'dev') return _cache;
      }
      catch (err) { 
        warn(err);
        if (NODE_ENV === 'dev') return err;
      }

    }), // end route
  
    httpServer = require('http').createServer(),
    wsServer = new(require('websocket')).server({ httpServer });
    
  httpServer.on('request', (request, response) => {
    makeRoute({ 'protocol': 'HTTP', request, response, dbconfig })
      .then(({ router, options }) => { new router(options) })
      .catch(({ message }) => {
        response.statusCode = 404;
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify({ 'message': `${message} - not found!` }));
      });
  });
  
  wsServer.on('request', request => {

    // route((Route, options) => {
    //   new Route();
    // });


  });

  httpServer.on('listening', () => {

    log([
      `Listening:`,
      `-> ${host}:${port}${appsDir}`,
      '-'.repeat(4 + host.length + `${port}`.length + appsDir.length),
      '\n.'.repeat(6)
    ].join('\n'));

  });

  return {
    makeRoute,
    host,
    port,
    appsDir,
    'listen': () => httpServer.listen({ host, port }),
    'close': () => httpServer.close()
  };
};

if (NODE_ENV !== 'dev') module.exports().listen();





























// /****
// * module: Load
// * 
// * powered by Moreira in 2091--02-06
// * 
// * https://github.com/theturtle32/WebSocket-Node
// ****/
// // module.exports.version = '1.1.0';

// const 
//   { assign } = Object, 
//   { log, warn } = console, 
//   { join } = require('path'), 
//   { existsSync, statSync, realpathSync, readFileSync } = require('fs');

// log([
//   '\n.'.repeat(3),
//   `Starting server..`,
//   `-> ${new Date().toISOString()}`,
//   `-> ${__filename}`,
//   '-'.repeat(3 + Math.max(24, __filename.length))
// ].join('\n'));

// module.exports = function(env) {

//   env = assign({}, process.env, env);
  
//   const { host, port, appsDir, dbconfig } = (() => {
    
//     // leitura da atributo CONFIG do arquivos package.json 
//     // iniciado pelo pm2.
//     let {
//       host = 'localhost',
//       port = 3001,
//       appsDir = 'dist',
//       dbconfig
//     } = JSON.parse(env.CONFIG || '{}');

//     dbconfig = (dbconfig => {
//       if (!dbconfig) return {};
//       if ('object' === typeof(dbconfig)) return dbconfig;
      
//       if ('string' === typeof(dbconfig)) {
//         switch (dbconfig.slice(0, 1)) {
//           case '/':
//           break;
//         case '~':
//           dbconfig = join(env.HOME, dbconfig.slice(1));
//           break;
//         default:
//           dbconfig = join(env.cwd, dbconfig);
//         }
//         if (!(existsSync(dbconfig) && statSync(dbconfig).isFile())) return {};
//       }

//       try {return JSON.parse(readFileSync(dbconfig).toString())}
//       catch(err) { return {} }
        
//     })(dbconfig);

//     switch (appsDir.slice(0, 1)) {
//     case '/':
//       break;
//     case '~':
//       appsDir = join(env.HOME, appsDir.slice(1));
//       break;
//     default:
//       appsDir = join(env.cwd, appsDir);
//     }

//     return { host, port, appsDir, dbconfig };

//   })();
  
//   const 
//     _routers = {},
//     route = options => new Promise((accept, reject) => {
      
//       const 
//         { protocol } = options,
//         { method, originalUrl } = options.request,
//         routeName = originalUrl.split('/').slice(0, 3).join('/'),
//         routers = _routers[protocol] || (_routers[protocol] = {});

//       process.env.NODE_ENV === 'dev' || log([
//         ` `,
//         `-> ${new Date().toISOString()} - ${protocol} ${method} ${originalUrl}`,
//         '-'.repeat(32 + method.length + originalUrl.length + protocol.toString().length)
//       ].join('\n'));
      
//       // cache first level micro service
//       if (!routers[routeName]) {
        
//         const 
//           dirname = join(appsDir, routeName.slice(1).replace('/', '-')),
//           packagejson = join(dirname, 'package.json');
          
//         if (!(existsSync(packagejson) && statSync(packagejson).isFile())) {
//           const error = assign({ 'message': 'package.json' }, options);
//           reject(error);
//           return process.env.NODE_ENV === 'dev' && error;
//         }
        
//         const { main, version, CONFIG } = JSON.parse(readFileSync(packagejson).toString());
//         if (!(existsSync(join(dirname, main)) && main.endsWith('.js'))) {
//           const error = assign({ 'message': 'main: <executable.js>' }, options);
//           reject(error);
//           return process.env.NODE_ENV === 'dev' && error;
//         }
        
//         routers[routeName] = [
//           require(join(dirname, main)),
//           assign({ version, 'appname': routeName.slice(1).split('/')[1], 'dirname': realpathSync(dirname) }, CONFIG)
//         ];
//       }
      
//       try { 
//         accept({ 
//           'router': routers[routeName][0],
//           'options': assign({}, routers[routeName][1], options, { 'url': originalUrl.replace(routeName, '') })
//         });
//         if (process.env.NODE_ENV === 'dev') return _routers;
//       }
//       catch (err) { 
//         warn(err);
//         if (process.env.NODE_ENV === 'dev') return err;
//       }
      
//     });
//     // end route
  
//   const
//     httpServer = require('http').createServer(),
//     wsServer = new(require('websocket')).server({ httpServer });
    
//   httpServer.on('request', (request, response) => {
    
//     request.originalUrl = request.url;
    
//     route({ 'protocol': 'HTTP', request, response })
//       .then(({ router, options }) => { new router(options) })
//       .catch(({ message }) => {
//         response.statusCode = 404;
//         response.setHeader('content-type', 'application/json');
//         response.end(JSON.stringify({ 'message': `${message} - not found!` }));
//       });
    
//   });
  
//   wsServer.on('request', request => {

//     // route((Route, options) => {
//     //   new Route();
//     // });


//   });

//   httpServer.on('listening', () => {

//     log([
//       `Listening:`,
//       `-> ${host}:${port}${appsDir}`,
//       '-'.repeat(4 + host.length + `${port}`.length + appsDir.length),
//       '\n.'.repeat(6)
//     ].join('\n'));

//   });

//   return {
//     route,
//     host,
//     port,
//     appsDir,
//     'listen': () => httpServer.listen({ host, port }),
//     'close': () => httpServer.close()
//   };

// };

// if (process.env.NODE_ENV !== 'dev') module.exports().listen();
