import React, { useEffect, useMemo, useRef, useState } from "react"
import { Text, Layer, Rect, Stage } from "react-konva"

import moment from "../../../../utils/moment"

import { useGeomRenderingSocket } from "../../../../apis/GeomRendering"

// function MyText(props) {
//   useEffect(() => {
//     props.onUpdate()
//   })
//   return (<Text {...props} />)
// }

function GeomLayer(props) {
  const {
    classroomId,
    videoDate,
    width,
    height,
    style,
    getElapsed,
    videoStartTime,
    deviceId,
    deviceName,
    ...otherProps
  } = props

  const frameBufferSeconds = 25

  const [frameBufferTime, setFrameBufferTime] = useState(null)
  const frameBufferTimeRef = useRef(frameBufferTime)
  const [frameEpochIndex, setFrameEpochIndex] = useState(0)
  const [sample, setSample] = useState({})
  const [geoms, setGeoms] = useState([])
  const [coordinates, setCoordinates] = useState({})

  const projectCoordinate = coord => {
    if (coord === null || !sample || !sample.frame_width) {
      return null
    }

    const projection = width / sample.frame_width
    return coord * projection
  }

  const [requestGeoms, requestCoordinates] = useGeomRenderingSocket(
    useMemo(
      () => ({
        onGeoms: _data => {
          if (_data) {
            console.log("Geom object received in client")
            setSample(_data.sample)
            setGeoms(_data.geoms)
          }
        },
        onCoordinates: _data => {
          if (_data) {
            console.log("Coordinates object received in client")
            setCoordinates(_data)
          }
        }
      }),
      []
    )
  )

  useEffect(() => {
    let interval = null

    if (sample.start_time) {
      setFrameBufferTime(sample.start_time)

      interval = setInterval(() => {
        const elapsed = getElapsed()
        if (!elapsed) {
          return
        }

        const frameTime = moment.utc(videoStartTime).add(elapsed, "seconds")
        const frameBufferTimeMoment = moment.utc(frameBufferTimeRef.current)
        // console.log(`Current frameTime: ${frameTime}`)
        // console.log(`Buffer time: ${frameBufferTimeMoment}`)
        // console.log(`Diff: ${frameTime.diff(frameBufferTimeMoment, 'seconds')}`)
        if (
          frameTime.diff(frameBufferTimeMoment, "seconds") >=
          frameBufferSeconds - 5
          ||
          frameTime.diff(frameBufferTimeMoment, "seconds") < 0
        ) {
          setFrameBufferTime(frameTime)
        }

        const epoch = Math.round(frameTime.valueOf() / 100) * 100
        // console.log(epoch)
        setFrameEpochIndex(epoch)
      }, 1000 / sample.frames_per_second)
    }
    return () => {
      clearInterval(interval)
    }
  }, [sample, deviceId])

  useEffect(() => {
    frameBufferTimeRef.current = frameBufferTime
  }, [frameBufferTime])

  useEffect(() => {
    if (
      frameBufferTime &&
      Object.entries(sample).length > 0 &&
      sample.constructor === Object
    ) {
      requestCoordinates(sample.id, deviceId, frameBufferTime)
    }
  }, [frameBufferTime, sample, deviceId])

  useEffect(() => {
    requestGeoms(classroomId, videoDate)
  }, [classroomId, videoDate])

  return (
    <Stage
      style={Object.assign({}, { zIndex: 1000, position: "absolute" }, style)}
      width={width}
      height={height}
      {...otherProps}
    >
      <Layer>
        {geoms &&
          geoms
            .map(geom => {
              const [x, y] = (() => {
                if (
                  frameEpochIndex === 0 ||
                  !coordinates.hasOwnProperty(geom.id) ||
                  !coordinates[geom.id].hasOwnProperty(frameEpochIndex)
                ) {
                  return [null, null]
                }

                const geom_coordinates =
                  coordinates[geom.id][frameEpochIndex].coordinates
                return [
                  projectCoordinate(geom_coordinates[0]),
                  projectCoordinate(geom_coordinates[1])
                ]
              })()

              switch (geom.type) {
                case "Point2D":
                  return (
                    <Rect
                      id={geom.id}
                      key={`geom-${geom.id}`}
                      fill={geom.attributes.color}
                      x={x}
                      y={y}
                      width={5}
                      height={5}
                      visible={x !== null && y !== null}
                      // ref={node => {
                      //   addGeomRef(node)
                      // }}
                    />
                  )
                case "Text2D":
                  return (
                    <Text
                      id={geom.id}
                      key={`geom-${geom.id}`}
                      text={geom.attributes.text}
                      fontSize={16}
                      lineHeight={1.2}
                      fill={geom.attributes.color}
                      x={x}
                      y={y}
                      visible={x !== null && y !== null}
                      // ref={node => {
                      //   addGeomRef(node)
                      // }}
                    />
                  )
                default:
                  return null
              }
            })
            .filter(n => n)}
      </Layer>
    </Stage>
  )
}

export default GeomLayer
