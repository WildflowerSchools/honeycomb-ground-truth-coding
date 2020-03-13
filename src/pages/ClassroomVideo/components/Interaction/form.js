import React, { useState } from "react"

import { useForm } from "react-hook-form"
import DatePicker from "react-datepicker"
import PropTypes from "prop-types"
import { Button, Container, Form, Row } from "react-bootstrap"

import {
  GET_MATERIALS,
  GET_STUDENTS,
  GET_INTERACTION_ENUMS,
  GET_CONCENTRATION_ENUMS
} from "../../../../apis/Honeycomb/queries"
import {
  observationCodeToValue,
  engagementTypeToValue,
  concentrationOverallLevelToValue
} from "../../../../apis/Honeycomb/scalars"
import { useQuery } from "@apollo/react-hooks"

function Index(props) {
  const { handleSubmit, register, errors, setValue, reset } = useForm()

  const [interaction, setInteraction] = useState(props.interaction)

  React.useEffect(() => {
    register({ name: "endTime" }, { required: true })
    register({ name: "startTime" }, { required: true })
  }, [])

  const onSubmit = values => {
    console.log(values)
  }

  const onClear = () => {
    setValue("startTime", null)
    setValue("endTime", null)
    reset()
  }

  const {
    loading: materialsLoading,
    error: materialsError,
    data: materialsData
  } = useQuery(GET_MATERIALS)

  const {
    loading: studentsLoading,
    error: studentsError,
    data: studentsData
  } = useQuery(GET_STUDENTS)

  const {
    loading: interactionEnumsLoading,
    error: interactionEnumsError,
    data: interactionEnumsData
  } = useQuery(GET_INTERACTION_ENUMS)

  const {
    loading: concentrationEnumsLoading,
    error: concentrationEnumsError,
    data: concentrationEnumsData
  } = useQuery(GET_CONCENTRATION_ENUMS)

  if (
    materialsLoading ||
    studentsLoading ||
    interactionEnumsLoading ||
    concentrationEnumsLoading
  ) {
    return <div>Loading...</div>
  }

  if (
    materialsError ||
    studentsError ||
    interactionEnumsError ||
    concentrationEnumsError
  ) {
    return <div>Error!</div>
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="interaction.Child">
        <Form.Label>Child</Form.Label>
        <Form.Control
          as="select"
          name="child"
          ref={register({ required: true })}
        >
          <option key="person_null" />
          {studentsData.students.data.map(person => (
            <option key={person.person_id}>{person.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="interaction.Material">
        <Form.Label>Material</Form.Label>
        <Form.Control
          as="select"
          name="material"
          ref={register({ required: true })}
        >
          <option key="material_null" />
          {materialsData.materials.data.map(material => (
            <option key={material.material_id}>{material.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="interaction.StartTime">
        <Form.Label>Start</Form.Label>
        <div>
          <DatePicker
            className="form-control"
            selected={interaction.startTime}
            onChange={val => {
              setInteraction({ ...interaction, startTime: val })
              setValue("startTime", val)
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>
      </Form.Group>
      <Form.Group controlId="interaction.EndTime">
        <Form.Label>End</Form.Label>
        <div>
          <DatePicker
            className="form-control"
            selected={interaction.endTime}
            onChange={val => {
              setInteraction({ ...interaction, endTime: val })
              setValue("endTime", val)
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>
      </Form.Group>
      <Form.Group controlId="interaction.Code">
        <Form.Label>Observation Code</Form.Label>
        <Form.Control
          as="select"
          name="code"
          ref={register({ required: true })}
        >
          <option key="code_null" />
          {interactionEnumsData.enumObservationCodes.enumValues.map(code => (
            <option key={code.name}>{observationCodeToValue(code.name)}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="interaction.Concentration">
        <Form.Label>Concentration Level</Form.Label>
        <Form.Control
          as="select"
          name="concentration.overall"
          ref={register({ required: true })}
        >
          <option key="concentartion_null" />
          {concentrationEnumsData.enumConcentrationOverallLevels.enumValues.map(
            concentration => (
              <option key={concentration.name}>
                {concentrationOverallLevelToValue(concentration.name)}
              </option>
            )
          )}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="interaction.Engagement">
        <Form.Label>Engagement Type</Form.Label>
        <Form.Control
          as="select"
          name="engagementType"
          ref={register({ required: true })}
        >
          <option key="engagement_null" />
          {interactionEnumsData.enumEngagementTypes.enumValues.map(
            engagement => (
              <option key={engagement.name}>
                {engagementTypeToValue(engagement.name)}
              </option>
            )
          )}
        </Form.Control>
      </Form.Group>
      <Container className="d-flex">
        <Row className="ml-auto">
          <Button className="mr-2" variant="text" onClick={onClear}>
            Clear
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Row>
      </Container>
    </Form>
  )
}

Index.defaultProps = {
  interaction: {}
}

Index.propTypes = {
  interaction: PropTypes.object
}

export default Index
