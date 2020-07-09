import { ApolloServerBase, GraphQLOptions } from "apollo-server-core";
import { NowRequest, NowResponse } from "@vercel/node";
export interface CreateHandlerOptions {
    cors?: {
        origin?: boolean | string | string[];
        methods?: string | string[];
        allowedHeaders?: string | string[];
        exposedHeaders?: string | string[];
        credentials?: boolean;
        maxAge?: number;
    };
    onHealthCheck?: (req: NowRequest) => Promise<any>;
}
export declare class ApolloServer extends ApolloServerBase {
    createGraphQLServerOptions(req: NowRequest, res: NowResponse): Promise<GraphQLOptions>;
    createHandler({ cors, onHealthCheck }?: CreateHandlerOptions): (req: NowRequest, res: NowResponse) => Promise<void>;
}
