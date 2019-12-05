import React, { useState } from "react"

import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { ApolloLink } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { onError } from "apollo-link-error"
import { InMemoryCache } from "apollo-cache-inmemory"

import { useAuth0 } from "../../react-auth0-spa"

const HONEYCOMB_BASE_URL = process.env.GRAPHQL_URL

export const HoneycombProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("")
  const { getTokenSilently, loading } = useAuth0()

  if (loading) {
    return "Loading..."
  }

  const getAccessToken = async () => {
    try {
      const token = await getTokenSilently()
      setAccessToken(token)
    } catch (e) {
      console.error(e)
    }
  }
  getAccessToken()

  const httpLink = new HttpLink({
    uri: HONEYCOMB_BASE_URL
  })

  const authLink = setContext((_, { headers }) => {
    const token = accessToken
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`
        }
      }
    } else {
      return {
        headers: {
          ...headers
        }
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
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
