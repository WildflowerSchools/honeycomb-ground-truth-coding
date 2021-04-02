export const observationCodeToValue = (enum_id) => {
  switch (enum_id.toUpperCase()) {
    case "IC":
      return "Independent Choice"
    case "SC":
      return "Suggested Choice"
    case "DC":
      return "Directed Choice"
    case "CI":
      return "Child Influence"
    default:
      return enum_id
  }
}

export const engagementTypeToValue = (enum_id) => {
  switch (enum_id.toUpperCase()) {
    case "W":
      return "Working"
    case "GL":
      return "Getting Lesson"
    case "GA":
      return "Doing Group Activity"
    case "HA":
      return "Horsing Around"
    case "WAIT":
      return "Waiting"
    case "WD":
      return "Wandering"
    case "S":
      return "Snacking"
    case "OBS":
      return "Observing"
    case "OTHER":
      return "Other"
    default:
      return enum_id
  }
}

export const concentrationOverallLevelToValue = (enum_id) => {
  switch (enum_id.toUpperCase()) {
    case "DEEP_CONCENTRATION":
      return "Deep Concentration"
    case "CONCENTRATION":
      return "Concentration"
    case "DISTRACTED_WORKING":
      return "Distracted Working"
    case "QUIESENCE":
      return "Quiesence"
    case "SLIGHT_DISORDER":
      return "Slight Disorder"
    case "DISORDER":
      return "Disorder"
    case "UNCONTROLLABLE":
      return "Uncontrollable"
    default:
      return enum_id
  }
}

export const concentrationLevelToValue = (enum_id) => {
  switch (enum_id.toUpperCase()) {
    case "COMPLETELY":
      return "Completely"
    case "PARTIAL":
      return "Partial"
    case "NOT":
      return "Not"
    default:
      return enum_id
  }
}
