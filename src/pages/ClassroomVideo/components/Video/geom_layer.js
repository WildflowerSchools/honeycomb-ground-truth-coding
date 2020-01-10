import React, { useEffect, useState, useRef, useCallback } from "react"
import { Text, Layer, Rect, Stage } from "react-konva"

import moment from "../../../../utils/moment"

import axios from "axios"
//import data from "./geom_frames_full.json"

// function MyText(props) {
//   useEffect(() => {
//     props.onUpdate()
//   })
//   return (<Text {...props} />)
// }

function Index(props) {
  const {
    width,
    height,
    style,
    getElapsed,
    videoStartTime,
    deviceName,
    ...otherProps
  } = props

  const [frameIndex, setFrameIndex] = useState(0)
  const [data, setData] = useState({})
  const [geomStartTime, setGeomStartTime] = useState(data.start_time)
  const [referenceSize, setReferenceSize] = useState({
    width: data.frame_width,
    height: data.frame_height
  })
  const [frameRate, setFrameRate] = useState(data.frames_per_second)

  const projectCoordinate = coord => {
    if (coord === null || !referenceSize.width) {
      return null
    }

    const projection = width / referenceSize.width
    return coord * projection
  }

  useEffect(() => {
    let interval = null
    if (geomStartTime) {
      interval = setInterval(() => {
        const elapsed = getElapsed()
        if (!elapsed) {
          return
        }

        const frame = Math.round(elapsed * 10)

        const frameOffset =
          moment.utc(videoStartTime).diff(moment.utc(geomStartTime)) / 100

        //console.log(`Frame: ${frameOffset + frame}`)
        setFrameIndex(frameOffset + frame)
      }, 1000 / frameRate)
    }
    return () => clearInterval(interval)
  })

  useEffect(() => {
    const assignments = {
      "cc-1": "5b731bbc-5fe6-4cce-8c6a-dd61f7aade3b",
      "cc-10": "169abbbb-959f-421e-981d-158f69bbf1f5",
      "cc-11": "97a3ccd5-08ed-4cf6-8bcd-7475433f6bcd",
      "cc-12": "4a58f0fc-78e7-495b-8534-14564264a3bb",
      "cc-2": "fad62023-4864-4780-94d4-49d258cfd36f",
      "cc-20": "f3680a7f-a169-4c5b-9450-bb87e4bfb238",
      "cc-21": "33b4e7d9-4e44-4ba3-a9fb-9df51a90e746",
      "cc-22": "4494a424-9590-45bb-bc3e-f975f15b3a9e",
      "cc-3": "6d9aeaa6-9b4d-41ef-98fd-95c0842e90c0",
      "cc-4": "f3f72ade-8143-4dc3-91bf-93b10c89aac9",
      "cc-5": "c6fc2d0c-b5c9-47b2-a090-6f2b9d79b8b9",
      "cc-6": "d613f192-6576-4b55-a51e-d9af2c46c7a0",
      "cc-7": "38a85d1a-49d9-4ad5-9381-41c71c29bbaf",
      "cc-8": "db622710-8f88-422b-aff0-78e8ee9e2b92",
      "cc-9": "9acf317f-8f5e-41c2-8ee8-025e23c1baae"
    }
    console.log(deviceName)
    const assignmentId = assignments[deviceName]

    axios.get(`/assets/data/${assignmentId}_resampled.json`).then(response => {
      setData(response.data)
    })
    //const dataFilePath = `../../../../../public/assets/data/${assignmentId}_resampled.json`
    //const dataFile = require(`${dataFilePath}`)
    // setData(dataFile)
  }, [deviceName])

  useEffect(() => {
    console.log("Data source changed")
    setGeomStartTime(data.start_time)
    setReferenceSize({ width: data.frame_width, height: data.frame_height })
    setFrameRate(data.frames_per_second)
  }, [data])

  // const addGeomRef = ref => {
  //   geomRefs = [...geomRefs, ref]
  // }

  return (
    <Stage
      style={Object.assign({}, { zIndex: 1000, position: "absolute" }, style)}
      width={width}
      height={height}
      {...otherProps}
    >
      <Layer>
        {data &&
          data.geom_list &&
          data.geom_list
            .map(geom => {
              const [x, y] = (() => {
                if (frameIndex < 0 || data.coordinates.length <= frameIndex) {
                  return [null, null]
                }

                const coordinate_frame = data.coordinates[frameIndex]
                const geom_index = geom.coordinate_indices[0]
                return [
                  projectCoordinate(coordinate_frame[geom_index][0]),
                  projectCoordinate(coordinate_frame[geom_index][1])
                ]
              })()

              switch (geom.geom_type) {
                case "Point2D":
                  return (
                    <Rect
                      id={geom.id}
                      key={`geom-${geom.id}`}
                      fill={geom.color}
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
                      text={geom.text}
                      fontSize={16}
                      lineHeight={1.2}
                      fill={geom.color}
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

export default Index
