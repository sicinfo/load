"use strict";
const HttpServer = function (env = {}) {
    const { join } = require('path'), { existsSync, statSync, readFileSync, realpathSync } = require('fs'), { CONFIG = {} } = env, appsDir = realpathSync((({ appsDir = 'dist' }) => {
        var _a, _b, _c;
        switch (appsDir.slice(0, 1)) {
            case '/':
                return appsDir;
            case '~':
                return join((_a = env) === null || _a === void 0 ? void 0 : _a.HOME, appsDir.slice(1));
            default:
                return join(((_b = env) === null || _b === void 0 ? void 0 : _b.pm_cwd) || ((_c = env) === null || _c === void 0 ? void 0 : _c.cwd) || __dirname, appsDir);
        }
    })(CONFIG)), dbconfig = (({ dbconfig = {} }) => {
        var _a;
        if ('string' === typeof (dbconfig)) {
            switch (dbconfig.slice(0, 1)) {
                case '/':
                    break;
                case '~':
                    dbconfig = join(env.HOME, dbconfig.slice(1));
                    break;
                default:
                    dbconfig = join((_a = env) === null || _a === void 0 ? void 0 : _a.cwd, dbconfig);
            }
            if (!(existsSync(dbconfig) && statSync(dbconfig).isFile()))
                dbconfig = {};
        }
        if ('object' !== typeof (dbconfig)) {
            try {
                dbconfig = JSON.parse(readFileSync(dbconfig).toString());
            }
            catch (err) {
                dbconfig = {};
            }
        }
        return dbconfig;
    })(CONFIG), { prefixDir = 'WS' } = CONFIG, httpServer = require('http').createServer(), wmap = new Map();
    httpServer.on('request', (request, response) => {
        const url = request.url.split('?')[0].replace(/^\/|\/$/g, '').split('/'), _module = (arg => arg ? `${prefixDir}-${arg}` : '')(url.shift());
        env.NODE_ENV && (({ method, url }, _date) => (({ log }) => log)(console)([
            `-> ${_date} - HTTP ${method} ${url}`
        ].join('\n')))(request, new Date().toISOString());
        try {
            if (!_module)
                throw {
                    'code': 'MODULE_NOT_FOUND',
                    'message': `/${_module} `
                };
            const dirname = realpathSync(join(appsDir, _module));
            if (!statSync(dirname).isDirectory())
                throw {
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
        const { address, port } = httpServer.address(), node_env = (arg => arg ? ` (${arg})` : '')(env.NODE_ENV), lns = [
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
    const teste = 'nome', { pm_cwd, HOME } = process.env, CONFIG = require(`${HOME}/etc/${pm_cwd.split('/').slice(-1)}/config_load.json`);
    console.log(teste);
    Reflect.set(CONFIG, 'appsDir', pm_cwd);
    HttpServer(Object.assign({}, process.env, { CONFIG, 'NODE_ENV': 'DEV' })).listen(process.env.PORT_LOAD);
})();
