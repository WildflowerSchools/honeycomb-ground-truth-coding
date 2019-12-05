import gql from "graphql-tag"

export const GET_ENVIRONMENTS = gql`
  query environmentList {
    environments {
      data {
        environment_id
        name
        location
      }
    }
  }
`
