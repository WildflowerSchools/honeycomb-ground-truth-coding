import React, { useEffect, useState, useRef, useCallback } from "react"
import { Text, Layer, Rect, Stage } from "react-konva"

import data from "./geom_frames_full.json"

// function MyText(props) {
//   useEffect(() => {
//     props.onUpdate()
//   })
//   return (<Text {...props} />)
// }

function Index(props) {
  const { width, height, style, getElapsed, ...otherProps } = props

  const [frameIndex, setFrameIndex] = useState(0)
  const time = useState(data.startTime)[0]
  const referenceCanvas = useState(data.referenceCanvas)[0]
  const frameRate = useState(data.frameRate)[0]

  const projectCoordinate = coord => {
    if (coord === null || !referenceCanvas.width) {
      return null
    }

    const projection = width / referenceCanvas.width
    return coord * projection
  }

  useEffect(() => {
    let interval = null
    if (time) {
      interval = setInterval(() => {
        const elapsed = getElapsed()
        if (!elapsed) {
          return
        }

        const frame = Math.round(elapsed * 10)
        setFrameIndex(frame)
      }, 1000 / frameRate)
    }
    return () => clearInterval(interval)
  })

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
        {data.geom_list
          .map(geom => {
            const [x, y] = (() => {
              if (frameIndex < 0 || data.coordinates.length < frameIndex) {
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
                    fill={geom.line_color}
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
                    fill={geom.text_color}
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
