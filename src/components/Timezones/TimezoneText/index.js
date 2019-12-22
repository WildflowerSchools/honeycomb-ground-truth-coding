import React from "react"

import { useSettings } from "../../../settings"

function Index(props) {
  const { timezone } = useSettings()

  const Wrapper = props.as || "div"
  const { utcDate, format, ...otherProps } = props

  if (!utcDate) {
    return <div>loading...</div>
  }

  return (
    <Wrapper {...otherProps}>{utcDate.tz(timezone).format(format)}</Wrapper>
  )
}

export default Index
