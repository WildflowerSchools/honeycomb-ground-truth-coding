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
    materials(page: { sort: { field: "name" } }) {
      data {
        material_id
        name
        description
      }
    }
  }
`

export const GET_STUDENTS = gql`
  query getStudents {
    students: searchPersons(
      query: { field: "person_type", operator: EQ, value: "STUDENT" }
      page: { sort: { field: "name" } }
    ) {
      data {
        person_id
        name
        first_name
        last_name
        person_type
      }
    }
  }
`

export const GET_INTERACTION_ENUMS = gql`
  query interactionEnums {
    enumObservationCodes: __type(name: "ObservationCodes") {
      name
      enumValues {
        name
      }
    }
    enumEngagementTypes: __type(name: "EngagementType") {
      name
      enumValues {
        name
      }
    }
    enumSourceType: __type(name: "SourceType") {
      name
      enumValues {
        name
      }
    }
  }
`

export const GET_CONCENTRATION_ENUMS = gql`
  query concentrationEnums {
    enumConcentrationOverallLevels: __type(name: "ConcentrationLevel") {
      name
      enumValues {
        name
      }
    }
    enumConcentrationLevels: __type(name: "Level") {
      name
      enumValues {
        name
      }
    }
  }
`
