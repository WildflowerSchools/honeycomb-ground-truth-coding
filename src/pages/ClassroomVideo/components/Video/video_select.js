import React, { useEffect, useState } from "react"
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap"
import HLSPlayer from "./hls_player"

const VideoSelect = React.memo((props) => {
  const { videos = [], activeVideo, setActiveVideo } = props

  const [videosHidden, setVideosHidden] = useState(
    videos.reduce((acc, video) => {
      acc[video.url] = false
      return acc
    }, {})
  )

  const handleVideoSelected = (video) => {
    setActiveVideo(video)
  }

  useEffect(() => {
    setVideosHidden(
      videos.reduce((acc, video) => {
        acc[video.url] = false
        return acc
      }, {})
    )

    if (!activeVideo && videos && videos.length) {
      setActiveVideo(videos[0])
    }
  }, [videos])

  const setVideoHidden = (video, hidden) => {
    setVideosHidden((prev) => Object.assign({}, prev, { [video.url]: hidden }))
  }

  const styles = {
    rowMainMT: { marginTop: "20px" },
    thumbnailsPT: { paddingTop: "0px" },
    thumbnailsShortcut: {
      position: "absolute",
      color: "yellow",
      top: "50%",
      left: "50%",
      margin: "auto",
      transform: "translate(-50%, -50%)",
    },
  }

  return (
    <Row style={styles.rowMainMT} noGutters={true}>
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
                videosHidden[video.url] ? "d-none" : "",
              ].join(" ")}
              xs={4}
              md={4}
              lg={4}
              key={ii}
              style={styles.thumbnailsPT}
              onClick={() => {
                handleVideoSelected(video)
              }}
            >
              <HLSPlayer
                className={[
                  activeVideo && activeVideo.url === video.url
                    ? "active"
                    : "inactive",
                  videosHidden[video.url] ? "d-none" : "",
                ].join(" ")}
                streamPath={video.url}
                previewPath={video.preview_thumbnail_url}
                previewData={video.preview_thumbnail_data || null}
                controls={false}
                hidden={!!videosHidden[video.url]}
                setHidden={(hidden) => {
                  setVideoHidden(video, hidden)
                }}
              />
              <p style={styles.thumbnailsShortcut}>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")[ii]}
              </p>
            </Col>
          </OverlayTrigger>
        )
      })}
    </Row>
  )
})

export default VideoSelect
