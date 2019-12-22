import React, { useEffect, useState } from "react"
import axios from "axios"
import { makeUseAxios } from "axios-hooks"
import { useAuth0 } from "../../react-auth0-spa"
import { combineURLs } from "../../utils/helper"

const VIDEO_STREAMER_BASE_URL = process.env.HONEYCOMB_VIDEO_STREAM_URI

export const getURLWithPath = path => {
  return combineURLs(VIDEO_STREAMER_BASE_URL, path)
}

export const buildM3U8Path = (classroomId, videoDate, deviceName) => {
  return `videos/${classroomId}/${videoDate}/${deviceName}/output.m3u8`
}

/**
 * Wrap axios hook so an auth token can be injected in VideoStream API requests
 *
 * @param config
 * @param options
 * @returns {{data: any, loading: boolean, error: AxiosError}}
 */
export const useVideoStreamer = (config, options = {}) => {
  const { getTokenSilently } = useAuth0()

  const client = axios.create({
    baseURL: VIDEO_STREAMER_BASE_URL
  })
  client.interceptors.request.use(async function(config) {
    let token = await getTokenSilently()

    config.headers["Authorization"] = `Bearer ${token}`
    return config
  })

  const useAxios = makeUseAxios({
    axios: client
  })

  const [{ data, loading, error }] = useAxios(config, options)
  const [proxiedResult, setProxiedResult] = useState({
    data: data,
    loading: loading,
    error: error
  })

  const proxyError = function(e) {
    console.error("Request Failed:", e.config)

    if (error.response) {
      console.error("Status:", e.response.status)
      console.error("Data:", e.response.data)
      console.error("Headers:", e.response.headers)
    } else {
      console.error("Error Message:", e.message)
    }

    return e
  }

  useEffect(() => {
    let { error: proxiedError } = { loading, data, error }
    if (!loading) {
      if (error) {
        proxiedError = proxyError(error)
      }
    }

    setProxiedResult({ loading: loading, data: data, error: proxiedError })
  }, [loading, data, error])

  return proxiedResult
}
