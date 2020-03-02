/**
 * @module: Load
 *
 * powered by Moreira in 2091--02-06
 *
 * https://github.com/theturtle32/WebSocket-Node
 *
 * typescript:
 * https://medium.com/@oieduardorabelo/typescript-o-guia-definitivo-1a63b04259cc
 */

const { join } = require('path');
const { readFileSync } = require('fs');

const appsDir = process.env.pm_exec_path;
const etcDir = process.env.pm_cwd.replace('apps_node', 'etc/apps_node');
const port = process.env.PORT_LOAD;
const node_env = 'DEV';
const prefixDir = 'DEV';
const cfgs = new Map();
const apps = new WeakMap();

require('http').createServer().on('request', function (req, res) {
  req.method = req.method.toUpperCase();

  if ('DEV' === node_env) console.log(
    `-> ${prefixDir}: ${new Date().toISOString()} - HTTP ${req.method} ${req.url}`
  );

  const 
    url = req.url.split('?')[0].replace(/^\/|\/$/g, '').split('/'),
    url0 = (arg => arg ? `${prefixDir}-${arg}` : '')(url.shift()),
    cfg = join(etcDir, `${url0}.json`);

  try {

    if (!cfgs.has(cfg)) {
      const {
        version, main, dbconfig = {}, dirname = join(appsDir, url0)
      } = JSON.parse(readFileSync(cfg, { encoding: 'utf8' }));
      if (undefined === main) throw { 'code': 'MAIN_NOT_FOUND' };
      cfgs.set(cfg, { main, dbconfig, dirname, version });
    }

    const { main, dirname, dbconfig, version } = cfgs.get(cfg);
    new (require(join(dirname, main)))({ req, res, dirname, dbconfig, url, version });

  } catch (err) {
    
    console.warn(err.stack);
    console.warn(typeof (err));

    cfgs.delete(cfg);
    if ("MODULE_NOT_FOUND" === err.code) err.code = err.code.replace('MODULE', 'ROUTE')

    res.statusCode = 502;
    res.end(JSON.stringify(err));

  }

}).on('clientError', function (err, socket) {

  console.log(71, [__filename, err.stack].join('\n'));

}).on('listening', function () {

  const { address, port } = this.address();
  const lns = [
    `${process.title.split(' ')[0]} ${process.version}`,
    `${new Date().toISOString()}: Listening (${node_env}):`,
    `-> ${address}:${port}${appsDir}`,
    '\n.'.repeat(6)
  ];

  console.log(
    ['-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)), ...lns].join('\n')
  );

}).listen(port);

// , function() {

//   const
//     lns = [
//     `${new Date().toISOString()}: Listening (${node_env}):`,
//     `-> ${this.address().address}:${port}${appsDir}`,
//     '\n.'.repeat(6)
//   ];

//   console.log(['-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)), ...lns].join('\n'));

// });






  //   opts.jsonfile && cacheMap.set(jsonfile, {

  //   });

  //   }











  //     join(opts.json || cacheMap.get(opts.jsonfile);




  //   Router = require(join(opts.dirname, opts.main));


  //   const { main, dbconfig, app, dirname } = Object.assign(opts,
  //     dirname = opts.dirname join(appsDir, opts.app),
  //     args = cacheMap.get(opts.jsonfile),
  //     { main, dbconfig } = opts;



  //     Router = require(join(opts.dirname, opts.main));

  //   if (Reflect.get(jsonfile),  cacheMap.get()




  //     req,
  //   })








  // import(join(etcDir, `${app}.json`)).then(json => {
  //   import(join(dirname, json.main))
  //     .then(arg => arg.default || arg)
  //     .then(Router => {
  //       weakMap.has(json) ||
  //       weakMap.set(json, { dirname }); // { dbconfig }
  //       const args = { req, res, 'cache': weakMap.get(json), url };
  //       new Router(args);
  //     })





  // } catch (err) { opts.err = err }

  // if (opts.err) {

  //   console.warn(opts.err);
  //   if ("MODULE_NOT_FOUND" === opts.err.code) {
  //     opts.err.code = opts.err.code.replace('MODULE', 'ROUTE')
  //   }

  //   res.statusCode = 502;
  //   res.end(JSON.stringify(opts.err));

  // }






  //   const






  // }








  //   Object.assign(opts, { dirname = join(appsDir, app), main , dbconfig } = readFileSync(jsonfile));

  //   try {



  //   }



  //   const opts = {
  //     dirname: dirname = join(appsDir, app)
  //   };

  //   const { main}








  // const cbRouter = (err, json) => {


  //   if (err) {
  //     res.statusCode = 502;
  //     console.warn(err);
  //     if ("MODULE_NOT_FOUND" === err.code) err.code = err.code.replace('MODULE', 'ROUTE')
  //     res.end(JSON.stringify(err));
  //   }

  //   else try {
  //     const router =


  //   }



  //   if (!dirname) {
  //     dirname = join(appsDir, app)


  //   }

  //   const
  //     dirname = join(appsDir, app),
  //     main = join(dirname, main);
  //     Router = require(join(dirname, main));

  //   _map.set(jsonfile, { main, dirname });

  //   if (existsSync(jsonfile)) {

  //   }





  //   try {
  //     const Router = require('')
  //   }

  // });

//   }

//   if (!cacheMap.has(jsonfile)) {

//     const
//       dirname = join(appsDir, app),
//       { main , dbconfig } = readFileSync(jsonfile);

//     try {



//     }



//     const opts = {
//       dirname: dirname = join(appsDir, app)
//     };

//     const { main}








//     cacheMap.set(jsonfile, {});






//   }
//   cbrouter(null, _map.get(jsonfile), true) &&
//   readFile(jsonfile, _cbrouter);


//   try {

//     const json = require

//   }

//   import(join(etcDir, `${app}.json`)).then(json => {
//     import(join(dirname, json.main))
//       .then(arg => arg.default || arg)
//       .then(Router => {
//         weakMap.has(json) ||
//         weakMap.set(json, { dirname }); // { dbconfig }
//         const args = { req, res, 'cache': weakMap.get(json), url };
//         new Router(args);
//       })
//   }).catch(err => {
//     res.statusCode = 502;
//     console.warn(err);
//     if ("MODULE_NOT_FOUND" === err.code) err.code = err.code.replace('MODULE', 'ROUTE')
//     res.end(JSON.stringify(err));
//   })

// }).listen(port, address, () => {

//   const lns = [
//     `${new Date().toISOString()}: Listening (${node_env}):`,
//     `-> ${address}:${port}${appsDir}`,
//     '\n.'.repeat(6)
//   ];

//   console.log(['-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)), ...lns].join('\n'));

// });