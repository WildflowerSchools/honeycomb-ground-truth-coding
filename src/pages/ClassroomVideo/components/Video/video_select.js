import React, { useEffect, useState } from "react"
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap"
import HLSPlayer from "./hls_player"

const VideoSelect = React.memo(props => {
  const { videos = [], onVideoSelected = () => {} } = props

  const [videosHidden, setVideosHidden] = useState(
    videos.reduce((acc, video) => {
      acc[video.url] = false
      return acc
    }, {})
  )
  const [activeVideoUrl, setActiveVideoUrl] = useState(null)

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

  const styles = {
    rowMainMT: { marginTop: "20px" },
    thumbnailsPT: { paddingTop: "10px" }
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
                videosHidden[video.url] ? "d-none" : ""
              ].join(" ")}
              xs={4}
              md={3}
              lg={2}
              key={ii}
              style={styles.thumbnailsPT}
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
                previewPath={video.preview_thumbnail_url}
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
})

export default VideoSelect
