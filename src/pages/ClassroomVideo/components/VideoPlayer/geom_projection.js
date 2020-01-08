import React, { useEffect, useState, useRef, useCallback } from "react"
import { Text, Layer, Rect, Stage } from "react-konva"
import moment from "../../../../utils/moment"

import data from "./geom_frames.json"

function Index(props) {
  const { width, height } = props

  let geomRefs = []

  const [rectRef, setRectRef] = useState(null)
  //const [geomRefs, setGeomRefs] = useState([])
  const [geoms, setGeoms] = useState([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [time, setTime] = useState("2019-12-17T15:59:50+00:00")

  const projectCoordinate = coord => {
    if (coord === null) {
      return null
    }

    const projection = width / data.referenceCanvas.width
    return coord * projection
  }

  useEffect(() => {
    let interval = null
    if (time) {
      interval = setInterval(() => {
        const frame = moment(time).diff(moment(data.startTime)) / 100
        if (frame < 300) {
          setFrameIndex(frame)
          setTime(prev =>
            moment
              .utc(time)
              .add(100)
              .format("YYYY-MM-DDTHH:mm:ss.SSSZ")
          )
        }
      }, 100)
    }
    return () => clearInterval(interval)
  })

  // useEffect( () => {
  //   console.log("Redraw Geoms")
  //
  //   const frame = moment(time).diff(moment(data.startTime)) / 100
  //   //setFrameIndex(frame)
  //
  //   geomRefs.forEach((geomRef, idx) => {
  //     const rawGeom = data.geoms.find((geom) => {
  //       const id = geomRef ? geomRef.id() : null
  //
  //       if (id) {
  //         return id === geom.id
  //       }
  //     })
  //     console.log(`Frame: ${frame}`)
  //     if (rawGeom) {
  //       geomRef.x(projectCoordinate(data.coordinates[frame][rawGeom.coordinate_indices[0]][0]))
  //       geomRef.y(projectCoordinate(data.coordinates[frame][rawGeom.coordinate_indices[0]][1]))
  //     }
  //   })
  // }, [time, geomRefs])

  // useEffect( () => {
  //   let period = 500
  //
  //   if (rectRef) {
  //     const anim = new Konva.Animation(frame => {
  //       console.log(frame)
  //       rectRef.opacity((Math.sin(frame.time / period) + 1) / 2)
  //       rectRef.x(((Math.sin(frame.time / period) + 1) / 2) * width)
  //       rectRef.y(((Math.sin(frame.time / period) + 1) / 2) * height)
  //     }, rectRef.getLayer())
  //
  //     anim.start()
  //   }
  // }, [rectRef])

  // useEffect( () => {
  //   if (geomRefs) {
  //
  //   }
  // }, [time, geomRefs])

  const addGeomRef = ref => {
    geomRefs = [...geomRefs, ref]
    //setGeomRefs(prev => {return [...prev, ref]})
  }

  // const drawGeoms = () => {
  //   console.log("Draw Geoms")
  //   const geomObjects = data.geoms.map((geom) => {
  //     const x = projectCoordinate(data.coordinates[0][geom.coordinate_indices[0]][0])
  //     const y = projectCoordinate(data.coordinates[0][geom.coordinate_indices[0]][1])
  //
  //     switch (geom.geom_type) {
  //       case 'Point2D':
  //         return (<Rect
  //           id={geom.id}
  //           key={`geom-${geom.id}`}
  //           fill={geom.line_color}
  //           x={x}
  //           y={y}
  //           width={5}
  //           height={5}
  //           visible={x !== null && y !== null}
  //           ref={node => {
  //             addGeomRef(node)
  //           }} />)
  //       case 'Text2D':
  //         return (<Text
  //           id={geom.id}
  //           key={`geom-${geom.id}`}
  //           text={geom.text}
  //           fontSize={16}
  //           lineHeight={1.2}
  //           fill={geom.text_color}
  //           x={x}
  //           y={y}
  //           visible={x !== null && y !== null}
  //           ref={node => {
  //             addGeomRef(node)
  //           }} />)
  //       default:
  //         return null
  //     }
  //   }).filter(n => n)
  //
  //   return geomObjects
  // }
  //
  // const geomObjects = React.Children.toArray(drawGeoms(0))

  return (
    <Stage
      style={{ zIndex: 1000, position: "absolute" }}
      width={width}
      height={height}
    >
      <Layer>
        {React.Children.toArray(
          data.geoms
            .map(geom => {
              const x = projectCoordinate(
                data.coordinates[frameIndex][geom.coordinate_indices[0]][0]
              )
              const y = projectCoordinate(
                data.coordinates[frameIndex][geom.coordinate_indices[0]][1]
              )

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
                      ref={node => {
                        addGeomRef(node)
                      }}
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
                      ref={node => {
                        addGeomRef(node)
                      }}
                    />
                  )
                default:
                  return null
              }
            })
            .filter(n => n)
        )}
      </Layer>
    </Stage>
  )
}
//Index.defaultProps = { time: '2019-12-17T15:59:50+00:00' }

export default Index
