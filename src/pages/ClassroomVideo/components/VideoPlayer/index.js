import React, { useEffect, useState, useRef, useCallback } from "react"
import {
  Container,
  Col,
  OverlayTrigger,
  ResponsiveEmbed,
  Row,
  Tooltip
} from "react-bootstrap"
import ButtonDatePicker from "../../../../components/ButtonDatePicker"
import ReactPlayer from "react-player"
import { Stage, Layer, Rect, Text } from 'react-konva'
import { useAuth0 } from "../../../../react-auth0-spa"
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

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function VideoContainer(props) {
  const {
    streamPath,
    controls,
    hidden,
    setHidden,
    showGeomLayer,
    onProgress,
    startPlaybackAt
  } = props

  const [accessToken, setAccessToken] = useState("")
  const [playing, setPlaying] = useState(false)
  const [hlsRef, setHlsRef] = useState(null)
  const [rectRef, setRectRef] = useState(null)
  const { getTokenSilently } = useAuth0()

  const ready = streamPath !== undefined && accessToken !== ""

  const hlsRefSet = useCallback(ref => {
      setHlsRef(ref)
  })

  useEffect( () => {
    let period = 500

    if (rectRef) {
      const anim = new Konva.Animation(frame => {
        rectRef.opacity((Math.sin(frame.time / period) + 1) / 2)
      }, rectRef.getLayer())

      anim.start()
    }
  }, [rectRef])

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

  const handleOnProgress = progress => {
    if (onProgress) {
      onProgress(progress)
    }
  }

  const handleOnPause = () => {
    setPlaying(false)
  }

  const handleOnPlay = () => {
    setPlaying(true)
  }

  const handleOnEnded = () => {
    setPlaying(false)
  }

  return (
    <>
      {ready ? (
        <>
          <ResponsiveEmbed
            className={`hls-container ${props.className}`}
            aspectRatio="4by3"
            hidden={hidden}
          >
            <div>
              {showGeomLayer &&
                <Stage
                  style={{zIndex: 1000, position: 'absolute'}}
                  width={hlsRef  ? hlsRef.wrapper.firstElementChild.getBoundingClientRect().width : 0}
                  height={hlsRef  ? hlsRef.wrapper.firstElementChild.getBoundingClientRect().height : 0}>
                  <Layer>
                    <Rect
                      x={20}
                      y={20}
                      width={50}
                      height={50}
                      fill='green'
                      shadowBlur={5}
                      ref={node => {
                        setRectRef(node)
                      }}/>
                  </Layer>
                </Stage>
              }
              <ReactPlayer
                key={`react-player-${streamPath}`}
                ref={hlsRefSet}
                config={{
                  file: {
                    hlsOptions: {
                      xhrSetup: function(xhr, url) {
                        xhr.setRequestHeader(
                          "Authorization",
                          `Bearer ${accessToken}`
                        )
                        // Warning, onreadystatechange is not available to HLS' xhr object. Need to use the event listener instead.
                        xhr.addEventListener("loadend", function() {
                          if (xhr.status === 404) {
                            setHidden(true)
                          }
                        })
                      },
                      startPosition: startPlaybackAt
                    }
                  }
                }}
                controls={controls}
                url={getFullStreamURL(streamPath)}
                pip={false}
                onProgress={handleOnProgress}
                onPause={handleOnPause}
                onPlay={handleOnPlay}
                onEnded={handleOnEnded}
                playing={playing}
              />
            </div>
          </ResponsiveEmbed>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
VideoContainer.defaultProps = { startPlaybackAt: 0, hidden: false, showGeomLayer: false }

function VideoThumbnailsSelection(props) {
  const { videos, onVideoSelected } = props

  const [videosHidden, setVideosHidden] = useState(
    videos.reduce((acc, video) => {
      acc[video.url] = false
      return acc
    }, {})
  )
  const [activeVideoUrl, setActiveVideoUrl] = useState()

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
              <VideoContainer
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

function Index(props) {
  const classroomId = props.classroomId

  const TIME_FORMAT = "h:mm:ss A z"

  const [videoDate, setVideoDate] = useState(props.videoDate)
  const [availableDates, setAvailableDates] = useState([])
  const [activeVideoUrl, setActiveVideoUrl] = useState()
  const [videos, setVideos] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [playbackTime, setPlaybackTime] = useState(moment())
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

  const { loading } = useAuth0()

  useEffect(() => {
    if (feedLoading === false && feedData) {
      setVideos(feedData["videos"])

      if (feedData["videos"].length > 0) {
        setActiveVideoUrl(feedData["videos"][0].url)
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

  const onPlaybackProgress = progress => {
    if (progress && progress.playedSeconds) {
      setPlaybackTime(
        moment(startTime.clone().add(progress.playedSeconds, "seconds"))
      )
      setPlaybackProgress(progress.playedSeconds)
    }
  }

  const onVideoSelected = video => {
    setActiveVideoUrl(video.url)
  }

  return (
    <Container>
      <Row>
        <Col lg>
          {!loading && (
            <VideoContainer
              streamPath={activeVideoUrl}
              controls={true}
              showGeomLayer={true}
              onProgress={onPlaybackProgress}
              startPlaybackAt={playbackProgress}
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
            </Row>
          </Container>
        </Col>
      </Row>
      <hr />
      {!loading && (
        <VideoThumbnailsSelection
          videos={videos}
          onVideoSelected={onVideoSelected}
        />
      )}
    </Container>
  )
}

export default Index
