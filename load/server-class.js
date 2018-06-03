/**
 * 
 * 
 */
const symbol = Symbol();
const { stat, readFileSync } = require('fs');
const { join } = require('path');
const { createServer } = require('http');
const UpgradeClass = require('./upgrade-class');

class Server {

  constructor(args) {

    this[symbol] = {
      'port': args.port || 3000,
      'address': args.address || '127.0.0.1',
      'appsDirs': args.appsDirs || 'dist'
    }

  }

  onRequest(req, res) {
    const { appsDirs } = this[symbol];
    const { headers, url, method } = req;
    const _url = [headers.host.split('.')[0]].concat(url.split('/').slice(1));
    const reject = (msg, code )  => {
      res.writeHead(code || 404, { 'Content-Type': 'text/plain;charset=utf8' });
      res.end(msg);
    }

    if (_url.length < 3) {
      return reject();
    }

    if ('unload' === _url[2]) {

      const msg = ['unload:'];

      Object.keys(require.cache).filter((k, i) => i).forEach((k, i) => {
        msg.push('' + (i + 1) + ' - ' + k);
        delete require.cache[k];
      });

      return reject(msg.join('\n') + '\n', 200);
    }

    const base = join(appsDirs, `${_url[1]}_${_url[0]}`);

    // console.log(base);

    stat(base, (err, stats) => {

      if (err) reject((msg => {
        return 'ENOENT' === err.code ? msg.replace(`${appsDirs}/${_url[1]}_`, '') : msg;
      })(err.message));

      else if (stats.isDirectory()) {

        req.url = `/${_url.slice(2).join('/')}`;

        require(base)({ req, res });

      }

      else reject('not found');

    });
  }

  onConnection(socket) {

    console.log('connection')

  }

  onUpgrade(req, socket, header) {
    const { appsDirs } = this[symbol];
    const { headers, url, method } = req;
    const { host } = headers;
    const _url = [host.split('.')[0]].concat(url.split('/').slice(1));
    const _base = join(appsDirs, `${url[1]}_${url[0]}`);

    console.log(_base);

    stat(_base, (err, stats) => {

      if (!(err) && stats.isDirectory()) {
        require(_base)({ socket, method, url: `/${_url.slice(2).join('/')}` });
      }

    });

  }

  set(key, value) {
    this[symbol][key] = value;
  }

  get(key) {
    return this[symbol][key];
  }

  getSet(key, value) {
    const old = this.get(key);
    this.set(key, value);
    return old;
  }

  start(done) {
    const _this = this[symbol];
    const server = _this.server = createServer();

    //
    server.on('request', (...args) => this.onRequest(...args))

    //
    server.on('upgrade', (...args) => this.onUpgrade(...args));

    //
    server.on('connection', (...args) => this.onConnection(...args));

    //
    server.on('listening', (...args) => done.call(_this, ...args));

    //
    server.listen(
      _this.port,
      _this.address
    );
  }

  broadcast(message, client) { }

}


//
module.exports = { Server }

