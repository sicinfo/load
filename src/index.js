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

const { assign } = Object;

module.exports = (env) => {

  env = assign({}, process.env, env);
  
  const
    
    { host, port, appsDir, route }  = (() => {
      
      const { join } = require('path');

      // leitura da atributo CONFIG do arquivos package.json 
      // iniciado pelo pm2
      let {
        host = 'localhost',
        port = 3001,
        appsDir = 'dist'
      } = JSON.parse(env.CONFIG || '{}');
      
      switch (appsDir.slice(0, 1)) {
        case '/':
          break;
        case '~':
          appsDir = join(env.HOME, appsDir.slice(1));
          break;
        default:
          appsDir = join(env.cwd, appsDir);
      }
      
      const 
        _routers = {},
        route = (request, locals, done) => {
          
          const 
            { method = '' } = request,
            { protocol, originalUrl } = locals,
            routeName = originalUrl.split('/').slice(0, 3).join('/'),
            routers = _routers[protocol] || (_routers[protocol] = {});

          process.env.NODE_ENV === 'dev' || log([
            ` `,
            `-> ${new Date().toISOString()} - ${protocol} ${method} ${originalUrl}`,
            '-'.repeat(32 + method.length + originalUrl.length + protocol.length)
          ].join('\n'));
          
            
          // cache first level micro service
          if (!routers[routeName]) {
            const 
              { existsSync, statSync, realpathSync, readFileSync } = require('fs'),
              dirname = join(appsDir, routeName.slice(1).replace('/', '-')),
              packagejson = join(dirname, 'package.json');

            if (!(existsSync(packagejson) && statSync(packagejson).isFile())) 
              return done(
                  undefined, 
                  assign(locals, { 'message': 'package.json' })
                );
              
            const { main, version, CONFIG } = JSON.parse(readFileSync(packagejson));
                    
            if (!(existsSync(join(dirname, main)) && main.endsWith('.js')))
              return done(
                  undefined, 
                  assign(locals, { 'message': 'main: <executable.js>' })
                );
                
            routers[routeName] = [
              require(dirname), 
              assign({ version, 'dirname': realpathSync(dirname) }, CONFIG)
            ];
          }
          
          // concat args from applications to locals args;
          Object.keys(routers[routeName][1]).forEach(key => {
            key in locals || (locals[key] = routers[routeName][1][key]);
          });

          try { 
            done(
              routers[routeName][0],
              assign(locals, { 'url': originalUrl.replace(routeName, '') })
            );
          }
          catch (err) { warn(err) }

        };
    
      return { host, port, route, appsDir }; 
      
    })(),
    
    httpServer = require('http').createServer(),
    wsServer = new(require('websocket')).server({ httpServer });
  
  httpServer.on('request', (request, response) => {
    
    route(
      request, 
      
      { 
        'protocol': 'HTTP', 
        'originalUrl': request.url 
      },
      
      (Router, options) => {
        
        if (!Router) {
          response.statusCode = 404;
          response.setHeader('content-type', 'application/json');
          response.end(JSON.stringify({ 'message': `${options.message} - not found!` }));
          return;
        }
        
        new Router({ request, response, options });
      }
    );
    
  });
  
  wsServer.on('request', (req) => {
  
    route((Route, options) => {
      new Route();
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
  
  return {
    route, host, port, appsDir,
    'listen': () => httpServer.listen({ host, port }),
    'close': () => httpServer.close()
  };
  
};

if (process.env.NODE_ENV !== 'dev') module.exports().listen();




