import React, { useEffect, useState, useRef } from "react"
import {
  Container,
  Col,
  OverlayTrigger,
  ResponsiveEmbed,
  Row,
  Tooltip
} from "react-bootstrap"
import ButtonDatePicker from "../../../ClassroomSelect/components/ButtonDatePicker"
import ReactHLS from "react-hls-player"
import { useAuth0 } from "../../../../react-auth0-spa"
import { useSettings } from "../../../../settings"
import {
  useVideoStreamer,
  getURLWithPath as getFullStreamURL,
  buildM3U8Path
} from "../../../../apis/VideoStreamer"
import {
  GET_CLASSROOM_VIDEO_FEED,
  LIST_CLASSROOM_VIDEOS
} from "../../../../apis/VideoStreamer/queries"
import moment from "../../../../utils/moment"

import "./style.css"

function HLSContainer(props) {
  const { streamPath, controls } = props

  const [accessToken, setAccessToken] = useState("")
  const { getTokenSilently } = useAuth0()

  const ready = streamPath !== undefined && accessToken !== ""

  const hlsRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const getAccessToken = async () => {
      try {
        const token = await getTokenSilently()
        if (isMounted) {
          setAccessToken(token)
        }
      } catch (e) {
        console.error(e)
      }
    }
    getAccessToken()

    return () => {
      isMounted = false
    }
  }, [getTokenSilently, setAccessToken, hlsRef, ready])

  return (
    <ResponsiveEmbed
      className={`hls-container ${props.className}`}
      aspectRatio="4by3"
    >
      {ready ? (
        <div>
          <ReactHLS
            ref={hlsRef}
            hlsConfig={{
              xhrSetup: function(xhr, url) {
                xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`)
                //xhr.onreadystatechange = readystatechange.bind(this)
              }
            }}
            controls={controls}
            url={getFullStreamURL(streamPath)}
          />
        </div>
      ) : (
        <div />
      )}
    </ResponsiveEmbed>
  )
}

HLSContainer.defaultProps = {
  counter: 0
}

function Index(props) {
  const classroomId = props.classroomId

  const [videoDate, setVideoDate] = useState(props.videoDate)
  const [availableDates, setAvailableDates] = useState([])
  const [activeVideoPath, setActiveVideoPath] = useState()
  const [videos, setVideos] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

  const {
    loading: listLoading,
    error: listError,
    data: listData
  } = useVideoStreamer(LIST_CLASSROOM_VIDEOS(classroomId))
  const {
    data: feedData,
    loading: feedLoading,
    error: feedError
  } = useVideoStreamer(GET_CLASSROOM_VIDEO_FEED(classroomId, videoDate))

  const { isAuthenticated, loading, getTokenSilently } = useAuth0()
  const { timezone, setTimezone } = useSettings()

  useEffect(() => {
    if (feedLoading === false && feedData) {
      setVideos(feedData["videos"])

      if (feedData["videos"].length > 0) {
        setActiveVideoPath(
          buildM3U8Path(
            classroomId,
            videoDate,
            feedData["videos"][0].device_name
          )
        )
        //setActiveVideoPath(feedData["videos"][0].url)
      }

      setStartTime(feedData["start"])
      setEndTime(feedData["end"])
    }
  }, [feedLoading, feedData])

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
    <Container>
      <Row>
        <Col lg>
          {!loading && (
            <HLSContainer
              key={activeVideoPath}
              streamPath={activeVideoPath}
              controls={true}
            />
          )}
        </Col>
      </Row>
      <Row className="justify-content-between" style={{ marginTop: "20px" }}>
        <Col>
          <ButtonDatePicker
            placeholderText="Select Date..."
            selected={moment(videoDate).toDate()}
            onChange={d => setVideoDate(moment(d).format("YYYY-MM-DD"))}
            dateFormat="MMM dd, yyyy"
            includeDates={availableDates.map(d => moment(d).toDate())}
          />
        </Col>
        <Col className="justify-content-end">
          <Container>
            <Row className="justify-content-end">
              <h5>10:50 AM</h5>
            </Row>
          </Container>
        </Col>
      </Row>
      <hr />
      {!loading && (
        <Row style={{ marginTop: "20px" }} noGutters={true}>
          {videos.map((video, ii) => {
            const actualVideoURL = buildM3U8Path(
              classroomId,
              videoDate,
              video.device_name
            )

            return (
              <OverlayTrigger
                key={`hls-container-overlay-${ii}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`hls-container-tooltip-${ii}`}>
                    Camera: <strong>{video.device_name}</strong>.
                  </Tooltip>
                }
              >
                <Col
                  className={"hls-thumbnails"}
                  xs={4}
                  md={3}
                  lg={2}
                  key={ii}
                  style={{ paddingTop: "10px" }}
                  onClick={() => {
                    setActiveVideoPath(actualVideoURL)
                  }}
                >
                  <HLSContainer
                    className={
                      activeVideoPath === actualVideoURL ? "active" : "inactive"
                    }
                    streamPath={actualVideoURL}
                    controls={false}
                  />
                </Col>
              </OverlayTrigger>
            )
          })}
        </Row>
      )}
    </Container>
  )
}

export default Index
