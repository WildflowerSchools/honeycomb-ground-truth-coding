import React, { useState } from "react"

import Form from "react-bootstrap/Form"
import DatePicker from "react-datepicker"

import { GET_MATERIALS } from "../../../../../../apis/Honeycomb/queries"
import { useQuery } from "@apollo/react-hooks"

function Index(props) {
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  const {
    loading: materialsLoading,
    error: materialsError,
    data: materialsData
  } = useQuery(GET_MATERIALS)

  if (materialsLoading) {
    return <div>Loading...</div>
  }

  if (materialsError) {
    return <div>Error!</div>
  }
  return (
    <Form>
      <Form.Group controlId="interaction.Child">
        <Form.Label>Child</Form.Label>
        <Form.Control as="select">
          <option>Johnny</option>
          <option>Moira</option>
          <option>David</option>
          <option>Alexis</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="interaction.Material">
        <Form.Label>Material</Form.Label>
        <Form.Control as="select">
          {materialsData.materials.data.map(material => (
            <option key={material.material_id}>{material.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.StartTime">
        <Form.Label>Start</Form.Label>
        <DatePicker
          selected={startTime}
          onChange={date => setStartTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
      </Form.Group>
      <Form.Group controlId="exampleForm.EndTime">
        <Form.Label>End</Form.Label>
        <DatePicker
          selected={endTime}
          onChange={date => setEndTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
      </Form.Group>
    </Form>
  )
}

export default Index
