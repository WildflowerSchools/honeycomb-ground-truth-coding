import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle
} from "react"
import { useAuth0 } from "../../../../react-auth0-spa"
import { ResponsiveEmbed } from "react-bootstrap"
import GeomLayer from "./geom_layer"
import ReactPlayer from "react-player"
import { getURLWithPath as getFullStreamURL } from "../../../../apis/VideoStreamer"

const HLSPlayer = forwardRef((props, ref) => {
  const {
    streamPath,
    previewPath,
    controls,
    hidden,
    setHidden,
    classroomId,
    videoDate,
    showGeomLayer,
    onProgress,
    startPlaybackAt,
    startTime,
    deviceId,
    deviceName
  } = props

  useImperativeHandle(ref, () => ({
    getHlsRef() {
      return hlsRef
    },
    playing: playing,
    setPlaying: setPlaying
  }))

  const [accessToken, setAccessToken] = useState("")
  const [playing, setPlaying] = useState(false)
  const [hlsRef, setHlsRef] = useState(null)
  const { getTokenSilently } = useAuth0()

  const ready = streamPath !== undefined && accessToken !== ""

  const hlsRefSet = useCallback(
    ref => {
      setHlsRef(ref)
    },
    [streamPath]
  )

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

  const styles = {
    geomLayerPointerEvent: { pointerEvents: "none" },
    previewImgSizing: { width: "inherit", height: "inherit" }
  }

  const reactPlayerConfig = {
    file: {
      hlsOptions: {
        xhrSetup: function(xhr, url) {
          xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`)
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
                    style={styles.geomLayerPointerEvent}
                    getElapsed={hlsRef.getCurrentTime}
                    videoStartTime={startTime}
                    classroomId={classroomId}
                    videoDate={videoDate}
                    deviceId={deviceId}
                    deviceName={deviceName}
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
              {previewPath && (
                <img
                  src={getFullStreamURL(previewPath)}
                  onError={() => setHidden(true)}
                  style={styles.previewImgSizing}
                />
              )}
              {!previewPath && (
                <>
                  <ReactPlayer
                    key={`react-player-${streamPath}`}
                    ref={hlsRefSet}
                    config={reactPlayerConfig}
                    controls={controls}
                    url={getFullStreamURL(streamPath)}
                    pip={false}
                    onProgress={handleOnProgress}
                    progressInterval={100}
                    onPause={handleOnPause}
                    onPlay={handleOnPlay}
                    onEnded={handleOnEnded}
                    playing={playing}
                  />
                </>
              )}
            </div>
          </ResponsiveEmbed>
        </>
      ) : (
        <></>
      )}
    </>
  )
})
HLSPlayer.defaultProps = {
  startPlaybackAt: 0,
  hidden: false,
  showGeomLayer: false
}

export default HLSPlayer
