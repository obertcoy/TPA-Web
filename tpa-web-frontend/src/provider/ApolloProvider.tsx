import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from 'react'

export const backendHost = "http://localhost:8080"

export default function GetApolloProvider({ children, token }: { children: React.ReactNode, token: string | null }) {
    
    const client = new ApolloClient({
        uri: 'http://localhost:8080/query',
        cache: new InMemoryCache(),
        headers: {
            Authorization: token ? `${token}` : "",
        },

    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )

}
