import React, { useEffect, useState, useRef, useCallback } from "react"
import { useAuth0 } from "../../../../react-auth0-spa"
import { ResponsiveEmbed } from "react-bootstrap"
import GeomLayer from "./layer_geoms"
import ReactPlayer from "react-player"
import { getURLWithPath as getFullStreamURL } from "../../../../apis/VideoStreamer"

function VideoPlayer(props) {
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
              {showGeomLayer && hlsRef && (
                <>
                  <GeomLayer
                    className={`geom-layer`}
                    style={{ pointerEvents: "none" }}
                    getElapsed={hlsRef.getCurrentTime}
                    width={
                      hlsRef
                        ? hlsRef.wrapper.firstElementChild.getBoundingClientRect()
                            .width
                        : 0
                    }
                    height={
                      hlsRef
                        ? hlsRef.wrapper.firstElementChild.getBoundingClientRect()
                            .height
                        : 0
                    }
                  />
                </>
              )}
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
VideoPlayer.defaultProps = {
  startPlaybackAt: 0,
  hidden: false,
  showGeomLayer: false
}

export default VideoPlayer
