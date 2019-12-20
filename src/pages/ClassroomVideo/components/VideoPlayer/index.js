import React, { useEffect, useState, useRef } from "react"
import {
  Container,
  Col,
  OverlayTrigger,
  ResponsiveEmbed,
  Row,
  Tooltip
} from "react-bootstrap"
import ButtonDatePicker from "../../../../components/ButtonDatePicker"
import ReactHLS from "react-hls-player"
import { useAuth0 } from "../../../../react-auth0-spa"
import { useSettings } from "../../../../settings"
import {
  useVideoStreamer,
  getURLWithPath as getFullStreamURL
} from "../../../../apis/VideoStreamer"
import {
  GET_CLASSROOM_VIDEO_FEED,
  LIST_CLASSROOM_VIDEOS
} from "../../../../apis/VideoStreamer/queries"
import { TimezoneText } from "../../../../components/Timezones"
import moment from "../../../../utils/moment"

import "./style.css"

function HLSContainer(props) {
  const { streamPath, controls, hidden, setHidden } = props

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
  }, [getTokenSilently, setAccessToken, ready])

  return (
    <ResponsiveEmbed
      className={`hls-container ${props.className}`}
      aspectRatio="4by3"
      hidden={hidden}
    >
      {ready ? (
        <div>
          <ReactHLS
            ref={hlsRef}
            hlsConfig={{
              xhrSetup: function(xhr, url) {
                xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`)
                // Warning, onreadystatechange is not available to HLS' xhr object. Need to use the event listener instead.
                xhr.addEventListener("loadend", function() {
                  if (xhr.status === 404) {
                    setHidden(true)
                  }
                })
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

function VideoThumbnailsSelection(props) {
  const { videos, onVideoSelected } = props

  const [videosHidden, setVideosHidden] = useState(
    videos.reduce((acc, video) => {
      acc[video.url] = false
      return acc
    }, {})
  )
  const [activeVideo, setActiveVideo] = useState()

  const handleVideoSelected = video => {
    setActiveVideo(video)
    onVideoSelected(video)
  }

  useEffect(() => {
    setVideosHidden(
      videos.reduce((acc, video) => {
        acc[video.url] = false
        return acc
      }, {})
    )
    if (!activeVideo) {
      setActiveVideo(videos[0])
    }
  }, [videos])

  const setVideoHidden = (video, hidden) => {
    setVideosHidden(prev => Object.assign({}, prev, { [video.url]: hidden }))
  }

  return (
    <Row style={{ marginTop: "20px" }} noGutters={true}>
      {videos.map((video, ii) => {
        return (
          <OverlayTrigger
            key={`hls-container-overlay-${ii}`}
            className={videosHidden[video.url] ? "d-none" : ""}
            placement={"top"}
            overlay={
              <Tooltip id={`hls-container-tooltip-${ii}`}>
                Camera: <strong>{video.device_name}</strong>.
              </Tooltip>
            }
          >
            <Col
              className={[
                "hls-thumbnails",
                videosHidden[video.url] ? "d-none" : ""
              ].join(" ")}
              xs={4}
              md={3}
              lg={2}
              key={ii}
              style={{ paddingTop: "10px" }}
              onClick={() => {
                handleVideoSelected(video)
              }}
            >
              <HLSContainer
                className={[
                  activeVideo === video.url ? "active" : "inactive",
                  videosHidden[video.url] ? "d-none" : ""
                ].join(" ")}
                streamPath={video.url}
                controls={false}
                hidden={videosHidden[video.url]}
                setHidden={hidden => {
                  setVideoHidden(video, hidden)
                }}
              />
            </Col>
          </OverlayTrigger>
        )
      })}
    </Row>
  )
}

function Index(props) {
  const classroomId = props.classroomId

  const TIME_FORMAT = "h:mm:ss A z"

  const [videoDate, setVideoDate] = useState(props.videoDate)
  const [availableDates, setAvailableDates] = useState([])
  const [activeVideoPath, setActiveVideoPath] = useState()
  const [videos, setVideos] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [playbackTime, setPlaybackTime] = useState()

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

  const { loading } = useAuth0()
  const { timezone, setTimezone } = useSettings()

  useEffect(() => {
    if (feedLoading === false && feedData) {
      setVideos(feedData["videos"])

      if (feedData["videos"].length > 0) {
        setActiveVideoPath(feedData["videos"][0].url)
      }

      setStartTime(moment.utc(feedData["start"]))
      setEndTime(moment.utc(feedData["end"]))
      setPlaybackTime(moment.utc(feedData["start"]))
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
              <TimezoneText as="h5" utcDate={startTime} format={TIME_FORMAT} />
            </Row>
          </Container>
        </Col>
      </Row>
      <hr />
      {!loading && (
        <VideoThumbnailsSelection
          videos={videos}
          onVideoSelected={video => {
            setActiveVideoPath(video.url)
          }}
        />
      )}
    </Container>
  )
}

export default Index
