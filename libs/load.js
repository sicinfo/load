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
  
  appsDir = process.env.pm_exec_path,
  etcDir = process.env.pm_cwd.replace('apps_node', 'etc/apps_node'),
  envName = process.env.name,
  cfgs = new Map();

require('http').createServer().on('request', function (req, res) {

  if ('WS' !== envName) console.log(
    `-> ${envName}: ${new Date().toISOString()} - HTTP ${req.method} ${req.url}`
  );

  const 
    url = req.url.split('?')[0].replace(/^\/*|\/$/g, '').split('/'),
    app = (arg => arg ? `${envName}-${arg}` : '')(url.shift()),
    cfg = join(etcDir, `${app}.json`);

  try {

    if (!cfgs.has(cfg)) {
      const {
        version, main, dbConfig = {}, dirName = join(appsDir, app)
      } = JSON.parse(readFileSync(cfg, { encoding: 'utf8' }));
      if (undefined === main) throw { 'code': 'MAIN_NOT_FOUND' };
      cfgs.set(cfg, { main, dbConfig, dirName, version });
    }

    const { main, dirName, dbConfig, version } = cfgs.get(cfg);
    new (require(join(dirName, main)))({ req, res, envName, dirName, dbConfig, url, version });

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
    `${new Date().toISOString()}: Listening:`,
    `-> ${address}:${port}${appsDir}`,
    '\n.'.repeat(6)
  ];

  console.log(
    ['-'.repeat(1 * lns.reduce((a, b) => Math.max(a, b.length), 0)), ...lns].join('\n')
  );

}).listen(process.env[`PORT_${process.env.name}`]);
