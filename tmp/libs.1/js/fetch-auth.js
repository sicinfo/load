/***
 * application load
 * 
 * powered by Moreira 2018-12-31
 */
// 'use strict';

/* global fetch, localStorage, Headers, location, btoa, crypto, TextEncoder */

define([], () => {

  const
    AUTHORIZATION = 'authorization',
    KEY_AUTHORIZATION = btoa(`${location.hostname}/${AUTHORIZATION}`),
    APPLICATIONJSON = 'application/json',
    ALGORITHM = 'SHA-256',
    ACCEPT = 'accept',
    CONTENTTYPE = 'content-type',
    URLPREFIX = 'WS',

    // anexa no header ao enviar para o server
    fromLocalstorageToRemote = ({ headers }) => {
      if (headers.has(AUTHORIZATION)) return;
      const value = localStorage.getItem(KEY_AUTHORIZATION);
      value && headers.set(AUTHORIZATION, value);
    },

    // registra no locaStorage aos receber do server
    fromRemoteToLocalstorage = ({ ok, headers }) => {
      if (ok && headers.has(AUTHORIZATION)) {
        localStorage.setItem(KEY_AUTHORIZATION, headers.get(AUTHORIZATION));
      }
      else localStorage.removeItem(KEY_AUTHORIZATION);
    },

    _url = url => url.startsWith('/') ? url : `/${URLPREFIX}/${url}`,

    fetchAuth = (url, opt = {}) => {

      const headers = opt.headers || (opt.headers = new Headers());

      headers.append(ACCEPT, APPLICATIONJSON);
      headers.append(CONTENTTYPE, APPLICATIONJSON);

      if ('POST' === opt.method && opt.body && 'string' !== typeof(opt.body)) {
        opt.body = JSON.stringify(opt.body);
      }

      // console.log(59, 'enviando para o servidor');
      fromLocalstorageToRemote(opt);

      return fetch(_url(url), opt)
        .then(resp => {
          fromRemoteToLocalstorage(resp);
          return APPLICATIONJSON === resp.headers.get(CONTENTTYPE) ? resp.json() : resp;
        });

    },
    
    cryptoDigest = (arg, alg = 'SHA-256') => {
      return crypto.subtle.digest(
        alg, new TextEncoder('utf-8').encode(arg)
      ).then(value => Array.from(
        new Uint8Array(value)
      ).map(b => `00${b.toString(16)}`.slice(-2)).join(''));
    };
            
  return { fetchAuth, KEY_AUTHORIZATION, cryptoDigest };
});






















// /**
// * powered by Moreira 2018-12-31
// */
// 'use strict';

// /* global fetch, localStorage */

// define([], () => {

//   const
//   AUTHORIZATION = 'authorization',
//   HEADERS = 'headers',
//   APPLICATIONJSON = 'application/json',
//   ACCEPT = 'accept',
//   CONTENTTYPE = 'content-type',
//   URLPREFIX = 'WS',
//   _url = url => url.startsWith('/') ? url : `/${URLPREFIX}/${url}`,

//   fetchJson = (url, opt = {}) => {

//     const headers = opt[HEADERS] || (opt[HEADERS] = {});
//     ACCEPT in headers || (headers[ACCEPT] = APPLICATIONJSON);
//     CONTENTTYPE in headers || (headers[CONTENTTYPE] = APPLICATIONJSON);

//     return fetch(_url(url), opt).then(resp => resp.json());
//   },

//   fetchAuth = (url, opt = {}) => {

//     const headers = opt[HEADERS] || (opt[HEADERS] = {});
//     ACCEPT in headers || (headers[ACCEPT] = APPLICATIONJSON);
//     CONTENTTYPE in headers || (headers[CONTENTTYPE] = APPLICATIONJSON);

//     if (!(AUTHORIZATION in headers)) {
//       const token = localStorage.getItem(AUTHORIZATION);
//       if (token) headers[AUTHORIZATION] = token;
//     }

//     return fetch(_url(url), opt).then(resp => {

//       if (resp.ok && resp[HEADERS].has(AUTHORIZATION))
//         localStorage.setItem(AUTHORIZATION, resp[HEADERS].get(AUTHORIZATION));
//       else 
//         localStorage.removeItem(AUTHORIZATION);

//       return resp.json() || {};
//     });

//   };

//   return { fetchAuth, fetchJson };
// });