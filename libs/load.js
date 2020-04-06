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

const
  { join } = require('path'),
  { readFileSync } = require('fs'),

  appsDir = join(process.env.cwd, process.env.watch || 'dist'),
  etcDir = join(process.env.cwd, 'etc'),
  envName = process.env.name,
  port = process.env.PORT,
  cfgs = new Map(),
  isProdEnv = 'API' === envName.toUpperCase();

require('http').createServer().on('request', function (req, res) {

  isProdEnv || console.log(
    `-> ${envName}: ${new Date().toISOString()} - HTTP ${req.method} ${req.url}`
  );

  const
    [appName, ...url] = req.url.split('?')[0].replace(/^\/*|\/$/g, '').split('/'),
    cfg = join(etcDir, `app-${appName}.json`);

  try {

    const
      { main, dbConfig, version, description } = cfgs.get(cfg) || (() => {
        const
          { version, main, description } = JSON.parse(readFileSync(cfg, { encoding: 'utf8' })),
          dbConfig = {};

        if (undefined === main) throw { 'code': 'MAIN_NOT_FOUND' };
        try { Object.assign(dbConfig, JSON.parse(readFileSync(join(etcDir, `db-${appName}.json`)))) }
        catch (err) { }

        return (arg => cfgs.set(cfg, arg) && arg)({ main, dbConfig, version, description });
      })(),
      dirName = join(appsDir, `app-${appName}`);

    new (require(join(dirName, main)))({ req, res, appName, envName, dirName, dbConfig, url, version, description });
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

  const
    { address, port } = this.address(),
    lns = [
      `${process.title.split(' ')[0]} ${process.version}`,
      `${new Date().toISOString()}: Listening:`,
      `-> ${address}:${port}${appsDir}`,
      '\n.'.repeat(6)
    ];

  console.log(
    ['-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)), ...lns].join('\n')
  );

}).listen(port);
