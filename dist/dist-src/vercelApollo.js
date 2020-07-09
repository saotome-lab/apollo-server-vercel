import { runHttpQuery, convertNodeHttpToRequest } from "apollo-server-core";
import { setHeaders } from "./setHeaders.js";
export function graphqlVercel(options) {
  if (!options) throw new Error(`Apollo Server requires options.`);

  if (arguments.length > 1) {
    throw new Error(`Apollo Server expects exactly one argument, got ${arguments.length}`);
  }

  const graphqlHandler = async (req, res) => {
    try {
      const {
        graphqlResponse,
        responseInit
      } = await runHttpQuery([req, res], {
        method: req.method,
        options,
        query: req.method === `POST` ? req.body : req.query,
        request: convertNodeHttpToRequest(req)
      });
      setHeaders(res, responseInit.headers ?? {});
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