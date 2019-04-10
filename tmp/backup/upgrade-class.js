/**
 * 
 */
const symbol = Symbol();

module.exports = class {

  constructor({socket, url}) {
    this[symbol] = {
      'address': socket.remoteAddress,
      'port': socket.remotePort,
      'write': socket.write,
      url
    };
  }

  get url() {
    return this[symbol].url;
  }

  get name() {
    return `${this[symbol].address}:${this[symbol].port}`;
  }

  receiveMessage(message) {
    this[symbol].write(message)
  }

};