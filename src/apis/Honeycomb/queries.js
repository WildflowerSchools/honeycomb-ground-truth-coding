import gql from "graphql-tag"

export const GET_ENVIRONMENTS = gql`
  query environmentList {
    environments(page: { sort: { field: "name" } }) {
      data {
        environment_id
        name
        location
      }
    }
  }
`

export const GET_MATERIALS = gql`
  query getMaterials {
    materials(
      query: { field: "name", operator: LIKE, value: "*" }
      page: { sort: { field: "name" } }
    ) {
      data {
        material_id
        name
        description
      }
    }
  }
`
