import React, { useState } from "react"

import Form from "react-bootstrap/Form"
import DatePicker from "react-datepicker"

function Index(props) {
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  return (
    <Form>
      <Form.Group controlId="engagement.Child">
        <Form.Label>Child</Form.Label>
        <Form.Control as="select">
          <option>Johnny</option>
          <option>Moira</option>
          <option>David</option>
          <option>Alexis</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="engagement.Material">
        <Form.Label>Material</Form.Label>
        <Form.Control as="select">
          <option>Pink Tower</option>
          <option>Moveable Alphabet</option>
          <option>Sound Cylinders</option>
          <option>Puzzle Maps</option>
          <option>Binomial Cube</option>
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
