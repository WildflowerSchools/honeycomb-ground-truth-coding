import React, { useEffect, useState } from "react"
import { Container, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap"
import { useHistory, useLocation } from "react-router-dom"
import { useQuery } from "@apollo/react-hooks"
import queryString from "query-string"

import ButtonDatePicker from "../../../../components/ButtonDatePicker"
import { useAuth0 } from "../../../../react-auth0-spa"
import { useVideoStreamer } from "../../../../apis/VideoStreamer"
import HLSPlayer from "./hls_player"
import { GET_ENVIRONMENT_ASSIGNMENTS } from "../../../../apis/Honeycomb/queries"

import {
  GET_CLASSROOM_VIDEO_FEED,
  LIST_CLASSROOM_VIDEOS
} from "../../../../apis/VideoStreamer/queries"
import { TimezoneText } from "../../../../components/Timezones"
import moment from "../../../../utils/moment"

import "./style.css"

function VideoThumbnailsSelection(props) {
  const { videos, onVideoSelected } = props

  const [videosHidden, setVideosHidden] = useState(
    videos.reduce((acc, video) => {
      acc[video.url] = false
      return acc
    }, {})
  )
  const [activeVideoUrl, setActiveVideoUrl] = useState(props.activeVideoUrl)

  const handleVideoSelected = video => {
    setActiveVideoUrl(video.url)
    onVideoSelected(video)
  }

  useEffect(() => {
    setVideosHidden(
      videos.reduce((acc, video) => {
        acc[video.url] = false
        return acc
      }, {})
    )
    if (!activeVideoUrl && videos && videos.length) {
      setActiveVideoUrl(videos[0].url)
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
              <HLSPlayer
                className={[
                  activeVideoUrl === video.url ? "active" : "inactive",
                  videosHidden[video.url] ? "d-none" : ""
                ].join(" ")}
                streamPath={video.url}
                controls={false}
                hidden={!!videosHidden[video.url]}
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

function VideoPlayer(props) {
  const { classroomId, deviceName, videoTime } = props

  const history = useHistory()
  const location = useLocation()

  const TIME_FORMAT = "h:mm:ss A z"

  const [videoDate, setVideoDate] = useState(props.videoDate)
  const [availableDates, setAvailableDates] = useState([])
  const [activeVideo, setActiveVideo] = useState()
  const [activeVideoDeviceId, setActiveVideoDeviceId] = useState()
  const [videos, setVideos] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [playbackTime, setPlaybackTime] = useState(null)
  const [playbackProgress, setPlaybackProgress] = useState(0)

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
  const {
    loading: assignmentsLoading,
    error: assignmentsError,
    data: assignmentsData
  } = useQuery(GET_ENVIRONMENT_ASSIGNMENTS, {
    variables: { environment_id: classroomId }
  })

  const { loading } = useAuth0()

  useEffect(() => {
    if (feedLoading === false && feedData) {
      setVideos(feedData["videos"])

      if (feedData["videos"].length > 0) {
        const vIndex = (() => {
          if (deviceName) {
            const potentialIndex = feedData["videos"].findIndex(video => {
              return video.device_name === deviceName
            })
            return potentialIndex !== -1 ? potentialIndex : 0
          } else {
            return 0
          }
        })()

        setActiveVideo(feedData["videos"][vIndex])
      }

      setStartTime(moment.utc(feedData["start"]).format())
      setEndTime(moment.utc(feedData["end"]).format())
      if (videoTime) {
        const pbt = moment.utc(`${videoDate}T${videoTime}`)
        setPlaybackTime(pbt.format())

        const pbt_diff = pbt.diff(moment.utc(feedData["start"]), "seconds")
        if (pbt_diff > 0) {
          setPlaybackProgress(pbt_diff)
        }
      } else {
        setPlaybackTime(moment.utc(feedData["start"]).format())
      }
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

  useEffect(() => {
    if (activeVideo) {
      const query = queryString.parse(location.search)
      query.device = activeVideo.device_name
      history.replace({
        ...location,
        search: queryString.stringify(query, { encode: false })
      })
    }
  }, [activeVideo])

  useEffect(() => {
    if (playbackTime) {
      const query = queryString.parse(location.search)
      query.time = moment.utc(playbackTime).format("HH:mm:ss")
      history.replace({
        ...location,
        search: queryString.stringify(query, { encode: false })
      })
    }
  }, [playbackTime])

  useEffect(() => {
    if (!assignmentsLoading && assignmentsData && activeVideo) {
      const assignment = assignmentsData["getEnvironment"]["assignments"].find(
        a => a["assignment_id"] === activeVideo.device_id
      )
      setActiveVideoDeviceId(assignment["assigned"]["device_id"])
    }
  }, [assignmentsLoading, assignmentsData, activeVideo])

  const onPlaybackProgress = progress => {
    if (progress && progress.playedSeconds) {
      setPlaybackTime(
        // moment(moment.utc(startTime).clone().add(progress.playedSeconds, "seconds"))
        moment
          .utc(startTime)
          .clone()
          .add(progress.playedSeconds, "seconds")
          .format()
      )
      setPlaybackProgress(progress.playedSeconds)
    }
  }

  const onVideoSelected = video => {
    setActiveVideo(video)
  }

  return (
    <Container>
      <Row>
        <Col lg>
          {!loading && activeVideo && (
            <HLSPlayer
              classroomId={classroomId}
              videoDate={videoDate}
              streamPath={activeVideo.url}
              deviceId={activeVideoDeviceId}
              deviceName={activeVideo.device_name}
              controls={true}
              showGeomLayer={true}
              onProgress={onPlaybackProgress}
              startPlaybackAt={playbackProgress}
              startTime={startTime}
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
              <TimezoneText
                as="h5"
                utcDate={playbackTime}
                format={TIME_FORMAT}
              />
              {/*<Form.Control size="lg" type="text" placeholder={playbackTime} />*/}
            </Row>
          </Container>
        </Col>
      </Row>
      <hr />
      {!loading && activeVideo && (
        <VideoThumbnailsSelection
          videos={videos}
          onVideoSelected={onVideoSelected}
          activeVideoUrl={activeVideo.url}
        />
      )}
    </Container>
  )
}

export default VideoPlayer
