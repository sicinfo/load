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

const { stat, readFileSync } = require('fs');
const { join } = require('path');
const { Server } = require('./server-class');

//
const config = (() => {

  const config = {
    'PWD': process.env.pm_cwd || process.env.PWD,
    'HOME': process.env.HOME,
    'APPSDIRS': 'dist',
    'HOST': 'localhost',
    'PORT': 3000
  };

  Object.assign(config, JSON.parse(readFileSync(join(config.PWD, 'package.json'), 'utf-8')).config)

  if (!config.APPSDIRS.startsWith('/')) {
    config.APPSDIRS = join(config.APPSDIRS.startsWith('~') ? config.HOME : config.PWD, config.APPSDIRS);
  }
  return config
})();

new Server({
  'port': config.PORT,
  'appsDirs': config.APPSDIRS
}).start(function () {
  console.log('-'.repeat(37));
  console.log(`${this.address}:${this.port}${config.APPSDIRS}`);
  console.log('.\n'.repeat(5));
})



// // const httpServer = createServer((req, res) => {

// //   const { APPSDIRS } = config;

// //   // console.log(`${req.method} - ${req.headers.host}`);
// //   // console.log(`${req.method} - ${req.headers.origin}`);

// //   const url = [req.headers.host.split('.')[0]].concat(req.url.split('/').slice(1));

// //   // console.log(url);
// //   // console.log(req.method);

// //   if (url.length < 3) {
// //     return reject(res);
// //   }

// //   if ('unload' === url[2]) {

// //     const msg = ['unload:'];

// //     Object.keys(require.cache).filter((k, i) => i).forEach((k, i) => {
// //       msg.push('' + (i + 1) + ' - ' + k);
// //       delete require.cache[k];
// //     });

// //     reject(res, msg.join('\n') + '\n', 200);

// //     return;
// //   }

// //   const base = join(APPSDIRS, `${url[1]}_${url[0]}`);

// //   // console.log(base);

// //   stat(base, (err, stats) => {

// //     if (err) reject(res, (msg => {
// //       return 'ENOENT' === err.code ? msg.replace(`${APPSDIRS}/${url[1]}_`, '') : msg;
// //     })(err.message));

// //     else if (stats.isDirectory()) {

// //       req.url = `/${url.slice(2).join('/')}`;

// //       // console.log(options);
// //       // console.log(req.url);

// //       res.local = { config };

// //       require(base)(req, res);

// //     }

// //     else reject(res, 'not found');

// //   });

// // });


// class Server {

//   constructor(port = 3000, address = '127.0.0.1') {
//     this[symbol] = { port, address }
//   }

//   start(done) {

//     const server = this[symbol].server = createServer();

//     //
//     server.on('request', (req, res) => {

//       console.log('request', req.url)


//     });

//     //
//     server.on('upgrade', (req, socket, header) => {

//       console.log('upgrade', req.url)

//     });

//     //
//     server.on('connection', (socket) => {

//       console.log('connection')

//     });

//     //
//     server.on('listening', (...args) => {
//       done.call(this[symbol], ...args)
//     });

//     //
//     server.listen(
//       this[symbol].port,
//       this[symbol].address
//     );
//   }

//   broadcast(message, client) { }

// }













// // const httpServer = createServer().listen(config.PORT)

// // httpServer.on('request', (req, res) => {

// //   // console.log('request', req.url);


// //   const { APPSDIRS } = config;

// //   // console.log(`${req.method} - ${req.headers.host}`);
// //   // console.log(`${req.method} - ${req.headers.origin}`);

// //   const url = [req.headers.host.split('.')[0]].concat(req.url.split('/').slice(1));

// //   // console.log(url);
// //   // console.log(req.method);

// //   if (url.length < 3) {
// //     return reject(res);
// //   }

// //   if ('unload' === url[2]) {

// //     const msg = ['unload:'];

// //     Object.keys(require.cache).filter((k, i) => i).forEach((k, i) => {
// //       msg.push('' + (i + 1) + ' - ' + k);
// //       delete require.cache[k];
// //     });

// //     reject(res, msg.join('\n') + '\n', 200);

// //     return;
// //   }

// //   const base = join(APPSDIRS, `${url[1]}_${url[0]}`);

// //   // console.log(base);

// //   stat(base, (err, stats) => {

// //     if (err) reject(res, (msg => {
// //       return 'ENOENT' === err.code ? msg.replace(`${APPSDIRS}/${url[1]}_`, '') : msg;
// //     })(err.message));

// //     else if (stats.isDirectory()) {

// //       req.url = `/${url.slice(2).join('/')}`;

// //       // console.log(options);
// //       // console.log(req.url);

// //       res.local = { config };

// //       require(base)(req, res);

// //     }

// //     else reject(res, 'not found');

// //   });

// // });


// // httpServer.on('connection', socket => {

// //   console.log('connection')
// //   // // console.log(socket);
// //   // // console.log(socket.conne);

// //   // Object.keys(socket).forEach(key => {

// //   //   console.log(key, '      ', typeof(socket[key]))

// //   //   // if ('string' === typeof(socket[key])) {
// //   //   // console.log(key, '   ', socket[key]);
// //   //   // // console.log(req[key]);
// //   //   // }

// //   // });

// //   // ['connecting', 'host', 'handle'].forEach(key => {



// //   //   console.log(key, '       ', socket[key])

// //   // })



// //   // console.log('.')
// //   // console.log('.')
// //   // console.log('.')

// // });

// // class Client {

// //   constructor(socket) {
// //     this[symbol] = {
// //       'addrres': socket.address,
// //       'port': socket.remotePort,
// //       'write': socket.write
// //     };
// //   }

// //   get name() {
// //     return `${this[symbol].address}:${this[symbol].port}`;
// //   }

// //   receiveMessage(message) {
// //     this[symbol].write(message)
// //   }

// // }


// // httpServer.on('upgrade', (req, socket, head) => {




// //   const {headers, url} = req;

// //   console.log('upgrade', headers);

// //   Object.keys(headers).forEach(key => {

// //     console.log(`${key}     ${typeof(headers[key])}`)

// //   //   if ('string' === typeof(evt[key])) {
// //   //   console.log(key, '   ', evt[key]);
// //   //   // console.log(req[key]);
// //   //   }

// //   });

// //   // console.log(evt.client);
// //   // console.log('----------------------------------------------------------');
// //   // console.log(socket);
// //   // console.log('----------------------------------------------------------');
// //   console.log(url);
// //   console.log(headers.host);
// //   console.log(headers.origin);
// //   console.log(headers.accept);
// //   // console.log('----------------------------------------------------------');

// // })


// // // const socket = new WebSocket({ httpServer });

// // // socket.on('request', req => {

// // //   const { APPSDIRS } = config;

// // //   // Object.keys(req).forEach(key => {

// // //   //   if ('string' === typeof(req[key])) {
// // //   //   console.log(key, '   ', req[key]);
// // //   //   // console.log(req[key]);
// // //   //   }

// // //   // });

// // //   // console.log(Buffer.from(req.key, 'base64').toString('ascii'))


// // //   console.log(`${req.host} - ${req.origin} - ${req.resource}`);
// // //   // console.log(`${req.method} - ${req.headers.origin}`);

// // //   const url = [req.host.split('.')[0]].concat(req.resource.split('/').slice(1));

// // //   console.log(url);
// // //   // console.log(req.method);

// // //   if (url.length < 3) return;

// // //   const base = join(APPSDIRS, `${url[1]}_${url[0]}`);

// // //   console.log(base);

// // //   stat(base, (err, stats) => {

// // //     if (err) reject(res, (msg => {
// // //       return 'ENOENT' === err.code ? msg.replace(`${APPSDIRS}/${url[1]}_`, '') : msg;
// // //     })(err.message));

// // //     else if (stats.isDirectory()) {

// // //       // console.log(options);
// // //       // console.log(req.url);

// // //       // res.local = { config };

// // //       require(base)({ 
// // //         'url': `/${url.slice(2).join('/')}`,
// // //         'connection': req.accept(null, req.origin)
// // //       });

// // //     }

// // //     else reject(res, 'not found');

// // //   });

// // // })

// // httpServer.on('listening', err => {
// //   if (err) return;
// //   console.log([
// //     '-------------------------------------',
// //     `${config.HOST}:${config.PORT}${config.APPSDIRS}`,
// //     '.', '.', '.', '.', '.', '.'
// //   ].join('\n'));
// // });
