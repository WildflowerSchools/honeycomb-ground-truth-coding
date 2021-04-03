import React, { useEffect, useRef, useState } from "react"
import {
  Button,
  Container,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap"
import { useHotkeys } from "react-hotkeys-hook"
import { useLocation } from "react-router-dom"
import { useQuery } from "@apollo/react-hooks"
import { FaLink, FaDownload } from "react-icons/fa"
import queryString from "query-string"

import ButtonDatePicker from "../../../../components/ButtonDatePicker"
import { useAuth0 } from "../../../../react-auth0-spa"
import {
  useVideoStreamer,
  getVideoThumbnail,
} from "../../../../apis/VideoStreamer"
import HLSPlayer from "./hls_player"
import HLSPlayerControls from "./hls_player_controls"
import { GET_ENVIRONMENT_ASSIGNMENTS } from "../../../../apis/Honeycomb/queries"

import {
  GET_CLASSROOM_VIDEO_FEED,
  LIST_CLASSROOM_VIDEOS,
} from "../../../../apis/VideoStreamer/queries"
import {
  TimezoneText,
  TimezoneEditable,
} from "../../../../components/Timezones"
import moment from "../../../../utils/moment"

import "./style.css"
import { useSettings } from "../../../../settings"

function VideoPlayer(props) {
  const {
    classroomId,
    deviceName,
    videoTime,
    setVideos,
    activeVideo,
    setActiveVideo,
  } = props

  const location = useLocation()

  const TIME_FORMAT = "h:mm:ss.S A z"

  const { timezone } = useSettings()

  const [videoDate, setVideoDate] = useState(props.videoDate)
  const [availableDates, setAvailableDates] = useState([])
  const [activeVideoDeviceId, setActiveVideoDeviceId] = useState()
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [playbackTime, setPlaybackTime] = useState(null)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [editTimeZone, setEditTimezone] = useState(false)

  const {
    loading: listLoading,
    data: listData,
    error: listError,
  } = useVideoStreamer(LIST_CLASSROOM_VIDEOS(classroomId)) //useMemo(() => useVideoStreamer(LIST_CLASSROOM_VIDEOS(classroomId)), [classroomId])
  const {
    data: feedData,
    loading: feedLoading,
    error: feedError,
  } = useVideoStreamer(GET_CLASSROOM_VIDEO_FEED(classroomId, videoDate)) //useMemo( () => useVideoStreamer(GET_CLASSROOM_VIDEO_FEED(classroomId, videoDate)), [classroomId, videoDate])
  const {
    loading: assignmentsLoading,
    data: assignmentsData,
    error: assignmentsError,
  } = useQuery(GET_ENVIRONMENT_ASSIGNMENTS, {
    variables: { environment_id: classroomId },
  })

  const { loading, getTokenSilently } = useAuth0()

  const hlsPlayerRef = useRef()
  const selectDateTimeRef = useRef()
  const inputTimeRef = useRef()

  useEffect(async () => {
    if (feedLoading === false && feedData) {
      setVideos(feedData["videos"])

      const token = await getTokenSilently()
      feedData["videos"] = await Promise.all(
        feedData["videos"].map(async (video, ii) => {
          video["preview_thumbnail_data"] = await getVideoThumbnail(
            {
              url: video.preview_thumbnail_url,
              method: "GET",
            },
            token
          )
          return video
        })
      )

      if (feedData["videos"].length > 0) {
        const vIndex = (() => {
          if (deviceName) {
            const potentialIndex = feedData["videos"].findIndex((video) => {
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
        setPlaybackTime(pbt.valueOf())

        const pbt_diff = pbt.diff(moment.utc(feedData["start"]), "seconds")
        if (pbt_diff > 0) {
          setPlaybackProgress(pbt_diff)
        }
      } else {
        setPlaybackTime(moment.utc(feedData["start"]).valueOf())
      }
    }
  }, [feedLoading, feedData])

  const videoSwitchHotkeys = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((v) => `⇧+${v}`)
  useHotkeys(
    videoSwitchHotkeys.join(","),
    (event, handler) => {
      if (feedLoading === false && feedData) {
        const videoIdx = videoSwitchHotkeys.indexOf(handler.key)
        if (feedData["videos"].length >= videoIdx) {
          setActiveVideo(feedData["videos"][videoIdx])
        }
      }
    },
    [feedLoading, feedData]
  )

  useHotkeys(
    "d",
    () => {
      if (selectDateTimeRef.current) {
        selectDateTimeRef.current.setOpen(true)
      }
    },
    [selectDateTimeRef]
  )

  useHotkeys(
    "t",
    (event) => {
      if (editTimeZone) {
        if (inputTimeRef.current) {
          event.preventDefault()
          inputTimeRef.current.focus()
        }
      } else {
        handleEditTimeZone()
      }
    },
    [editTimeZone, inputTimeRef]
  )

  useEffect(() => {
    if (!listLoading && listData) {
      setAvailableDates(
        listData.dates.map((data) => {
          return data.date
        })
      )
    }
  }, [listLoading, listData])

  useEffect(() => {
    if (!assignmentsLoading && assignmentsData && activeVideo) {
      const assignment = assignmentsData["getEnvironment"]["assignments"].find(
        (a) => a["assignment_id"] === activeVideo.device_id
      )
      setActiveVideoDeviceId(assignment["assigned"]["device_id"])
    }
  }, [assignmentsLoading, assignmentsData, activeVideo])

  const onPlaybackProgress = (progress) => {
    if (progress && progress.hasOwnProperty("playedSeconds")) {
      setPlaybackTime(
        moment
          .utc(startTime)
          .clone()
          .add(progress.playedSeconds, "seconds")
          .valueOf()
      )
      setPlaybackProgress(progress.playedSeconds)
    }
  }

  const copyPageLink = () => {
    const query = queryString.parse(location.search)
    if (activeVideo) {
      query.device = activeVideo.device_name
    }
    if (playbackTime) {
      query.time = moment.utc(playbackTime).format("HH:mm:ss")
    }

    const pageLink = new URL(window.location)
    pageLink.search = queryString.stringify(query, { encode: false })
    const textArea = document.createElement("textarea")
    textArea.style.position = "absolute"
    textArea.style.top = "-10000px"
    textArea.style.left = "-10000px"
    textArea.value = pageLink.toString()
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }

  const downloadSnapshot = () => {
    const download = document.getElementById("download")
    const video = document.querySelector("video")
    const scale = 1.0

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth * scale
    canvas.height = video.videoHeight * scale
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
    const img = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    download.setAttribute("href", img)
  }

  const handleEditTimeZone = () => {
    setEditTimezone(true)
  }

  const seekTo = (newEpoch) => {
    if (!newEpoch) {
      return
    }

    const pbt = moment.utc(newEpoch)
    setPlaybackTime(pbt.valueOf())

    if (hlsPlayerRef.current) {
      const pbt_diff = pbt.diff(moment.utc(feedData["start"])) / 1000
      hlsPlayerRef.current.getHlsRef().seekTo(pbt_diff, "seconds")
    }
  }

  const styles = {
    controlsRowMT: { marginTop: "20px" },
    controlsRowFontSize: { fontSize: "1.4em" },
    controlsColumnMt: { borderRight: "1px solid black" },
    copyOverlayHideDuration: { hide: 200 },
  }
  return (
    <Container>
      <Row>
        <Col sm>
          {!loading && activeVideo && (
            <HLSPlayer
              ref={hlsPlayerRef}
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
      <Row className="align-items-center h-100" style={styles.controlsRowMT}>
        <Col
          sm={10}
          className="d-flex justify-content-between align-items-center h-100"
          style={styles.controlsRowFontSize}
        >
          <Row className="justify-content-start align-items-center h-100">
            <Col className="col-auto" style={styles.controlsColumnMt}>
              <HLSPlayerControls hlsPlayerRef={hlsPlayerRef} />
            </Col>
            <Col className="col-auto">
              {editTimeZone === false ? (
                <TimezoneText
                  as="h5"
                  className="mb-0"
                  epoch={playbackTime}
                  format={TIME_FORMAT}
                  onClick={handleEditTimeZone}
                />
              ) : (
                <TimezoneEditable
                  ref={inputTimeRef}
                  onSubmit={seekTo}
                  onBlur={() => {
                    setEditTimezone(false)
                  }}
                  epoch={playbackTime}
                  format={TIME_FORMAT}
                  timezone={timezone}
                />
              )}
            </Col>
            <Col className="col-auto pl-0">
              <OverlayTrigger
                placement="top"
                delay={styles.copyOverlayHideDuration}
                overlay={
                  <Tooltip id={"copy-link-tooltip"}>Link Copied!</Tooltip>
                }
                rootClose={true}
                trigger="click"
              >
                <Button variant="light" size="sm" onClick={copyPageLink}>
                  <FaLink />
                </Button>
              </OverlayTrigger>
            </Col>
            <Col className="col-auto pl-0">
              <a id="download" download="snapshot.png">
                <Button variant="light" size="sm" onClick={downloadSnapshot}>
                  <FaDownload />
                </Button>
              </a>
            </Col>
          </Row>
        </Col>
        <Col sm={2}>
          <div className="float-right">
            <ButtonDatePicker
              ref={selectDateTimeRef}
              placeholderText="Select Date..."
              selected={moment(videoDate).toDate()}
              onChange={(d) => setVideoDate(moment(d).format("YYYY-MM-DD"))}
              dateFormat="MMM dd, yyyy"
              includeDates={availableDates.map((d) => moment(d).toDate())}
            />
          </div>
        </Col>
      </Row>
      <hr />
      {/*{!loading && activeVideo && (*/}
      {/*  <VideoSelect*/}
      {/*    videos={videos}*/}
      {/*    onVideoSelected={onVideoSelected}*/}
      {/*    activeVideoUrl={activeVideo.url}*/}
      {/*  />*/}
      {/*)}*/}
    </Container>
  )
}

export default VideoPlayer
