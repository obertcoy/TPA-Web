import { ApolloClient, ApolloProvider, InMemoryCache, split } from "@apollo/client";
import { createHttpLink } from "@apollo/client/link/http";
import { getMainDefinition } from "@apollo/client/utilities"; 
import { DocumentNode } from 'graphql'; 
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import React from 'react'

export const backendHost = "http://localhost:8080"

export default function GetApolloProvider({ children, token }: { children: React.ReactNode, token: string | null }) {
    
    const httpLink = createHttpLink({
        uri: 'http://localhost:8080/query',
        headers: {
            Authorization: token ? `${token}` : "",
        },
    });

    const wsLink = new GraphQLWsLink(
        createClient({
            url: "ws://localhost:8080/query",
            connectionParams: {
                Authorization: token,
            },
        }),
    );

    const splitLink = split(
        ({ query } : { query: DocumentNode}) => {
            const definition = getMainDefinition(query);
            return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
        },
        wsLink, 
        httpLink
    );

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: splitLink, 
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}
