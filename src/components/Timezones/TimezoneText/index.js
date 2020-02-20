import React from "react"

import { useSettings } from "../../../settings"
import moment from "../../../utils/moment"

function TimezoneText(props) {
  const { timezone } = useSettings()

  const Wrapper = props.as || "React.Fragment"
  const { utcDate, format, ...otherProps } = props

  if (!utcDate) {
    return <Wrapper {...otherProps}>loading...</Wrapper>
  }

  return (
    <Wrapper {...otherProps}>
      {moment(utcDate)
        .tz(timezone)
        .format(format)}
    </Wrapper>
  )
}

export default TimezoneText
