import React from "react"

import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { ApolloLink } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { onError } from "apollo-link-error"
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"

import { useAuth0 } from "../../react-auth0-spa"

const HONEYCOMB_BASE_URL = process.env.HONEYCOMB_URI

export const HoneycombProvider = ({ children }) => {
  const { getTokenSilently, loading } = useAuth0()

  if (loading) {
    return "Loading..."
  }

  const httpLink = new HttpLink({
    uri: HONEYCOMB_BASE_URL,
  })

  const authLink = setContext(async (_, { headers }) => {
    const token = await getTokenSilently()
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      }
    } else {
      return {
        headers: {
          ...headers,
        },
      }
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }
  })

  const link = ApolloLink.from([errorLink, authLink.concat(httpLink)])
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [],
      },
    },
  })
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      fragmentMatcher,
    }),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
