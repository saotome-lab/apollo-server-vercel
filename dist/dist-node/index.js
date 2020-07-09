'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var apolloServerCore = require('apollo-server-core');
var graphqlPlaygroundHtml = require('@apollographql/graphql-playground-html');
var fetchHeaders = require('fetch-headers');

const setHeaders = (res, headers) => {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
};

function graphqlVercel(options) {
  if (!options) throw new Error(`Apollo Server requires options.`);

  if (arguments.length > 1) {
    throw new Error(`Apollo Server expects exactly one argument, got ${arguments.length}`);
  }

  const graphqlHandler = async (req, res) => {
    try {
      var _responseInit$headers;

      const {
        graphqlResponse,
        responseInit
      } = await apolloServerCore.runHttpQuery([req, res], {
        method: req.method,
        options,
        query: req.method === `POST` ? req.body : req.query,
        request: apolloServerCore.convertNodeHttpToRequest(req)
      });
      setHeaders(res, (_responseInit$headers = responseInit.headers) !== null && _responseInit$headers !== void 0 ? _responseInit$headers : {});
      res.statusCode = 200;
      res.send(graphqlResponse);
    } catch (error) {
      const err = error;
      if (err.headers) setHeaders(res, err.headers);
      res.statusCode = err.statusCode;
      res.send(err.message);
    }
  };

  return graphqlHandler;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
class ApolloServer extends apolloServerCore.ApolloServerBase {
  createGraphQLServerOptions(req, res) {
    return super.graphQLServerOptions({
      req,
      res
    });
  }

  createHandler({
    cors,
    onHealthCheck
  } = {}) {
    const corsHeaders = new fetchHeaders.Headers();

    if (cors) {
      if (cors.methods) {
        if (typeof cors.methods === `string`) {
          corsHeaders.set(`access-control-allow-methods`, cors.methods);
        } else if (Array.isArray(cors.methods)) {
          corsHeaders.set(`access-control-allow-methods`, cors.methods.join(`,`));
        }
      }

      if (cors.allowedHeaders) {
        if (typeof cors.allowedHeaders === `string`) {
          corsHeaders.set(`access-control-allow-headers`, cors.allowedHeaders);
        } else if (Array.isArray(cors.allowedHeaders)) {
          corsHeaders.set(`access-control-allow-headers`, cors.allowedHeaders.join(`,`));
        }
      }

      if (cors.exposedHeaders) {
        if (typeof cors.exposedHeaders === `string`) {
          corsHeaders.set(`access-control-expose-headers`, cors.exposedHeaders);
        } else if (Array.isArray(cors.exposedHeaders)) {
          corsHeaders.set(`access-control-expose-headers`, cors.exposedHeaders.join(`,`));
        }
      }

      if (cors.credentials) {
        corsHeaders.set(`access-control-allow-credentials`, `true`);
      }

      if (typeof cors.maxAge === `number`) {
        corsHeaders.set(`access-control-max-age`, cors.maxAge.toString());
      }
    }

    return async (req, res) => {
      const requestCorsHeaders = new fetchHeaders.Headers(corsHeaders);

      if (cors && cors.origin) {
        const requestOrigin = req.headers.origin;

        if (typeof cors.origin === `string`) {
          requestCorsHeaders.set(`access-control-allow-origin`, cors.origin);
        } else if (requestOrigin && (typeof cors.origin === `boolean` || Array.isArray(cors.origin) && requestOrigin && cors.origin.includes(requestOrigin))) {
          requestCorsHeaders.set(`access-control-allow-origin`, requestOrigin);
        }

        const requestAccessControlRequestHeaders = req.headers[`access-control-request-headers`];

        if (!cors.allowedHeaders && requestAccessControlRequestHeaders) {
          requestCorsHeaders.set(`access-control-allow-headers`, requestAccessControlRequestHeaders);
        }
      }

      const requestCorsHeadersObject = Object.fromEntries(requestCorsHeaders.entries());

      if (req.method === `OPTIONS`) {
        setHeaders(res, requestCorsHeadersObject);
        res.statusCode = 204;
        res.send(``);
      }

      if (req.url === `/.well-known/apollo/server-health`) {
        const successfulResponse = () => {
          setHeaders(res, _objectSpread({
            "Content-Type": `application/json`
          }, requestCorsHeadersObject));
          res.statusCode = 200;
          res.send({
            status: `pass`
          });
        };

        if (onHealthCheck) {
          try {
            await onHealthCheck(req);
            successfulResponse();
          } catch (_unused) {
            setHeaders(res, _objectSpread({
              "Content-Type": `application/json`
            }, requestCorsHeadersObject));
            res.statusCode = 503;
            res.send({
              status: `fail`
            });
          }
        } else {
          successfulResponse();
        }
      }

      if (this.playgroundOptions && req.method === `GET`) {
        const acceptHeader = req.headers.Accept || req.headers.accept;

        if (acceptHeader && acceptHeader.includes(`text/html`)) {
          const path = req.url || `/`;

          const playgroundRenderPageOptions = _objectSpread({
            endpoint: path
          }, this.playgroundOptions);

          setHeaders(res, _objectSpread({
            "Content-Type": `text/html`
          }, requestCorsHeadersObject));
          res.statusCode = 200;
          res.send(graphqlPlaygroundHtml.renderPlaygroundPage(playgroundRenderPageOptions));
        }
      }

      graphqlVercel(() => this.createGraphQLServerOptions(req, res));
    };
  }

}

exports.ApolloServer = ApolloServer;
//# sourceMappingURL=index.js.map
