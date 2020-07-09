import { GraphQLOptions } from "apollo-server-core";
import { ValueOrPromise } from "apollo-server-types";
import { NowRequest, NowResponse } from "@vercel/node";
declare type NowApiHandler = (req: NowRequest, res: NowResponse) => void;
export interface NowGraphQLOptionsFunction {
    (req?: NowRequest): ValueOrPromise<GraphQLOptions>;
}
export declare function graphqlVercel(options: GraphQLOptions | NowGraphQLOptionsFunction): NowApiHandler;
export {};
