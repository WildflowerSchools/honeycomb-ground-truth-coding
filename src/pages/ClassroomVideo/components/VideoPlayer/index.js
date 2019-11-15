import React, { useState } from "react"
import {
  Container,
  Col,
  DropdownButton,
  Dropdown,
  ResponsiveEmbed,
  Row
} from "react-bootstrap"
import DatePicker from "react-datepicker"
import { subDays } from "date-fns"

function Index(props) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 1))

  return (
    <Container>
      <Row className="justify-content-between">
        <Col>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            maxDate={subDays(new Date(), 1)}
          />
        </Col>
        <Col className="justify-content-end">
          <Container>
            <Row className="justify-content-end">
              <h5>10:50 AM</h5>
              <DropdownButton variant="outline-dark">
                <Dropdown.Item>EST</Dropdown.Item>
                <Dropdown.Item>CST</Dropdown.Item>
                <Dropdown.Item>MST</Dropdown.Item>
                <Dropdown.Item>PST</Dropdown.Item>
              </DropdownButton>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col lg>
          <ResponsiveEmbed aspectRatio="16by9">
            <iframe
              width="420"
              height="315"
              src="https://www.youtube.com/embed/2yqz9zgoC-U"
              allowFullScreen
            />
          </ResponsiveEmbed>
        </Col>
      </Row>
      <Row style={{ marginTop: "2 0px" }}>
        {[...Array(8)].map((_, ii) => {
          return (
            <Col xs={4} md={3} key={ii} style={{ paddingTop: "10px" }}>
              <ResponsiveEmbed aspectRatio="16by9">
                <iframe
                  width="420"
                  height="315"
                  src="https://www.youtube.com/embed/2yqz9zgoC-U"
                  allowFullScreen
                />
              </ResponsiveEmbed>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default Index
