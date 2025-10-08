// Apollo Client configuration for GraphQL communication with backend
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  from 
} from '@apollo/client'

/**
 * HTTP Link Configuration
 * - Points to our NestJS GraphQL endpoint
 * - In development, backend typically runs on port 3000
 * - In production, you'd change this to your deployed backend URL
 */
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // Backend GraphQL endpoint
  credentials: 'include', // Include cookies for authentication if needed
  headers: {
    'Content-Type': 'application/json',
  }
})

/**
 * Apollo Client Instance
 * - Manages GraphQL queries, mutations, and caching
 * - InMemoryCache stores query results to avoid unnecessary network requests
 * - Automatically handles loading states and error handling
 */
const client = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache({
    // Configure how different types are cached
    typePolicies: {
      Message: {
        // Use 'id' field as the unique identifier for Message objects
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

export default client