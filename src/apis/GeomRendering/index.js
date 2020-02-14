import React, { useEffect, useState, useCallback, useRef } from "react"

import { combineURLs } from "../../utils/helper"
import { useAuth0 } from "../../react-auth0-spa"

const HONEYCOMB_GEOM_SOCKET_URI = process.env.HONEYCOMB_GEOM_SOCKET_URI

let ws

export const useGeomRenderingSocket = options => {
  const { onGeoms, onCoordinates } = options

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const isAuthenticatedRef = useRef(isAuthenticated) // Use ref so setTimeout closure's can access latest value

  const { getTokenSilently } = useAuth0()

  const RECONNECT_TIMEOUT = 1500
  const PING_TIMEOUT = 30000
  const PONG_TIMEOUT = 5000

  let reconnectTimeout = RECONNECT_TIMEOUT
  let allowRefresh = true

  let reconnectInterval = null
  let pingInterval = null
  let pongInterval = null

  useEffect(() => {
    console.log("Creating Geom Socket...")
    connect()

    return () => {
      console.log("Destroying Geom Socket")
      allowRefresh = false

      if (reconnectInterval) {
        clearTimeout(reconnectInterval)
      }

      if (pingInterval) {
        clearTimeout(pingInterval)
      }

      if (pongInterval) {
        clearTimeout(pongInterval)
      }

      if (ws) {
        ws.close()
      }
    }
  }, [])

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  const connect = useCallback(() => {
    ws = new WebSocket(combineURLs(HONEYCOMB_GEOM_SOCKET_URI, "/ws"))

    ws.onopen = () => {
      console.log("Geom Socket connected!")

      //reconnectTimeout = RECONNECT_TIMEOUT
      clearTimeout(reconnectInterval) // clear Interval on on open of websocket connection

      const auth = async () => {
        const token = await getTokenSilently()
        sendMessage("auth", { Authorization: token }, true)
      }
      auth()

      heartbeat()
    }

    ws.onclose = e => {
      if (!allowRefresh) {
        return
      }

      console.log(
        `Geom Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          reconnectTimeout / 1000
        )} seconds.`,
        e.reason
      )

      reconnect()
    }

    // websocket onerror event listener
    ws.onerror = err => {
      console.error(
        "Geom Socket encountered error: ",
        err.message,
        "Closing socket"
      )

      ws.close()
    }

    ws.onmessage = event => {
      const parsedEvt = JSON.parse(event.data)

      console.log(`Geom Socket Received Message: ${parsedEvt.event}`)
      switch (parsedEvt.event) {
        case "pong":
          heartbeat()
          return
        case "error":
          if (parsedEvt.data.code === 4401) {
            console.log(`Geom Socket reported an auth error, abandoning socket`)
            allowRefresh = false
          }
          ws.close(parsedEvt.data.code)
          return
        case "authorized":
          console.log("Geom Socket authorized!")
          setIsAuthenticated(true)
          return
        case "geoms":
          if (onGeoms) {
            onGeoms(parsedEvt.data)
          }
          return
        case "coordinates":
          if (onCoordinates) {
            onCoordinates(parsedEvt.data)
          }
          return
      }
    }
  }, [])

  const sendMessage = useCallback((eventName, data, isAuthAttempt = false) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log(`Queuing Message ${eventName}, waiting for socket to open...`)
      setTimeout(() => {
        sendMessage(eventName, data, isAuthAttempt)
      }, 5000)
      return
    }

    if (!isAuthAttempt && !isAuthenticatedRef.current) {
      console.log(`Queuing Message ${eventName}, waiting for authorization...`)
      setTimeout(() => {
        sendMessage(eventName, data, isAuthAttempt)
      }, 5000)
      return
    }

    const msg = JSON.stringify({
      event: eventName,
      data: data
    })
    ws.send(msg)
    console.log(`Sent Message over Geom Socket: ${eventName}`)
  }, [])

  const reconnect = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      reconnectInterval = setTimeout(() => {
        reconnectTimeout += reconnectTimeout //increment retry interval
        connect()
      }, Math.min(10000, reconnectTimeout))
    }
  }

  const heartbeat = () => {
    clearTimeout(pongInterval)
    clearTimeout(pingInterval)

    // Ping every "PING_TIMEOUT" (30 seconds) and then wait upto "pongTimeout" (5 seconds) for a pong response'
    pingInterval = setTimeout(() => {
      sendMessage("ping", {})

      pongInterval = setTimeout(() => {
        console.log("No pong received, closing Geom Socket connection")
        ws.close()
      }, PONG_TIMEOUT)
    }, PING_TIMEOUT)
  }

  const requestGeoms = useCallback((environmentId, date) => {
    console.log(`Request Geoms isAuthenticated: ${isAuthenticated}`)
    sendMessage("getGeoms", { environment_id: environmentId, date: date })
  }, [])

  const requestCoordinates = useCallback((sampleId, deviceId, from) => {
    sendMessage("getCoordinates", {
      sample_id: sampleId,
      device_id: deviceId,
      from: from
    })
  }, [])

  return [requestGeoms, requestCoordinates]
}
