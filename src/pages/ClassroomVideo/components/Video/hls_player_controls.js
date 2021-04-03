import React from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap"
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa"
import { MdForward30, MdReplay10 } from "react-icons/md"

function HLSPlayerButton(props) {
  const { children, tooltip, ...other } = props
  const buttonStyle = {
    fontSize: "18px",
  }

  const delay = { show: 250, hide: 250 }

  const overlay = tooltip ? <Tooltip>{tooltip}</Tooltip> : <></>

  return (
    <OverlayTrigger placement="bottom" delay={delay} overlay={overlay}>
      <Button style={buttonStyle} {...other}>
        {children}
      </Button>
    </OverlayTrigger>
  )
}

function HLSPlayerControls(props) {
  const { hlsPlayerRef, ...other } = props

  const handleOnRewind = (seconds = 10) => {
    const currentTime = hlsPlayerRef.current.getHlsRef().getCurrentTime()
    hlsPlayerRef.current.getHlsRef().seekTo(currentTime - seconds, "seconds")
  }

  const handleOnFastForward = (seconds = 30) => {
    const currentTime = hlsPlayerRef.current.getHlsRef().getCurrentTime()
    hlsPlayerRef.current.getHlsRef().seekTo(currentTime + seconds, "seconds")
  }

  const handleOnStepBackward = () => {
    hlsPlayerRef.current.setPlaying(false)
    handleOnRewind(0.1)
  }

  const handleOnStepForward = () => {
    hlsPlayerRef.current.setPlaying(false)
    handleOnFastForward(0.1)
  }

  const handleOnPlay = () => {
    hlsPlayerRef.current.setPlaying(true)
  }

  const handleOnPause = () => {
    hlsPlayerRef.current.setPlaying(false)
  }

  useHotkeys(
    "space,left,right,f,b",
    (event, handler) => {
      switch (handler.key) {
        case "space":
          if (hlsPlayerRef.current.playing) {
            handleOnPause()
          } else {
            handleOnPlay()
          }
          break
        case "left":
          handleOnStepBackward()
          break
        case "right":
          handleOnStepForward()
          break
        case "f":
          handleOnFastForward()
          break
        case "b":
          handleOnRewind()
          break
      }
    },
    []
  )

  return (
    <ButtonGroup aria-label="Toolbar with video navigation buttons" {...other}>
      {hlsPlayerRef &&
        hlsPlayerRef.current &&
        hlsPlayerRef.current.getHlsRef() && (
          <>
            <HLSPlayerButton
              disabled={hlsPlayerRef.current.getHlsRef().getCurrentTime() < 10}
              tooltip="Rewind 10 seconds"
              onClick={() => {
                handleOnRewind(10)
              }}
              variant="light"
            >
              <MdReplay10 />
            </HLSPlayerButton>
            <HLSPlayerButton
              disabled={hlsPlayerRef.current.getHlsRef().getCurrentTime() <= 0}
              tooltip="Step back 1 frame"
              onClick={handleOnStepBackward}
              variant="light"
            >
              <FaStepBackward />
            </HLSPlayerButton>

            {hlsPlayerRef.current.playing === false ? (
              <HLSPlayerButton
                tooltip="Play"
                onClick={handleOnPlay}
                variant="light"
              >
                <FaPlay />
              </HLSPlayerButton>
            ) : (
              <HLSPlayerButton
                tooltip="Pause"
                onClick={handleOnPause}
                variant="light"
              >
                <FaPause />
              </HLSPlayerButton>
            )}

            <HLSPlayerButton
              tooltip="Step forward 1 frame"
              onClick={handleOnStepForward}
              variant="light"
            >
              <FaStepForward />
            </HLSPlayerButton>
            <HLSPlayerButton
              tooltip="Fast-forward 30 seconds"
              onClick={() => {
                handleOnFastForward(30)
              }}
              variant="light"
            >
              <MdForward30 />
            </HLSPlayerButton>
          </>
        )}
    </ButtonGroup>
  )
}

export default HLSPlayerControls
