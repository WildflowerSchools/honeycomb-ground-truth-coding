import React, { useEffect, useState } from "react"
import { Container, Col, Row, DropdownButton, Dropdown } from "react-bootstrap"
import { useVideoStreamer } from "../../apis/VideoStreamer"
import {
  LIST_CLASSROOMS,
  LIST_CLASSROOM_VIDEOS
} from "../../apis/VideoStreamer/queries"
import ButtonDatePicker from "../../components/ButtonDatePicker"
import { ROUTE_CLASSROOM_VIDEOS } from "../../routes"
import moment from "../../utils/moment"

import "./style.css"

function ClassroomDateSelect(props) {
  const { onChange, classroomId, ...other } = props

  const [availableDates, setAvailableDates] = useState([])

  const {
    loading: listLoading,
    error: listError,
    data: listData
  } = useVideoStreamer(LIST_CLASSROOM_VIDEOS(classroomId))

  useEffect(() => {
    if (!listLoading && listData) {
      setAvailableDates(
        listData.dates.map(data => {
          return data.date
        })
      )
    }
  }, [listLoading, listData])

  return (
    <div {...other}>
      {listLoading && <div>Loading...</div>}
      {!listLoading && (
        <ButtonDatePicker
          placeholderText="Select Date..."
          includeDates={availableDates.map(d => moment(d).toDate())}
          onChange={d => onChange(moment(d).format("YYYY-MM-DD"))}
          dateFormat="MMM dd, yyyy"
        />
      )}
    </div>
  )
}

function Index(props) {
  const {
    match: { params },
    history
  } = props

  const [classroom, setClassroom] = useState(params.classroom)
  const [videoDate, setVideoDate] = useState()

  const {
    loading: classroomsLoading,
    error: classroomsError,
    data: classroomsData
  } = useVideoStreamer(LIST_CLASSROOMS)

  useEffect(() => {
    if (classroom && videoDate) {
      history.push(ROUTE_CLASSROOM_VIDEOS(classroom.id, videoDate))
    }
  }, [classroom, videoDate])

  return (
    <Container>
      <Row className="justify-content-sm-center">
        <Col sm="auto">
          {classroomsLoading && <div>Loading...</div>}
          {!classroomsLoading && !classroomsError && classroomsData && (
            <DropdownButton
              className="mx-auto classroom-input"
              title={classroom ? classroom.name : "Select Classroom..."}
              size="lg"
              aria-label="Classroom Select"
            >
              {classroomsData.classrooms.map(classroom => (
                <Dropdown.Item
                  key={classroom.id}
                  onSelect={() => setClassroom(classroom)}
                >
                  {classroom.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          )}
          {classroom && (
            <ClassroomDateSelect
              className="mt-3 mx-auto classroom-input"
              classroomId={classroom.id}
              size="lg"
              onChange={date => setVideoDate(date)}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Index
