import React, { useEffect, useRef } from "react"

import { useSettings } from "../../../settings"
import moment from "../../../utils/moment"

import { Form } from "react-bootstrap"

const epochAsString = (epoch, timezone, format) => {
  return moment(epoch)
    .tz(timezone)
    .format(format)
    .toString()
}

const dateAsEpoch = (date, timezone, format) => {
  return moment(date, format)
    .tz(timezone)
    .valueOf()
}

function TimezoneEditable(props) {
  const {
    format,
    epoch,
    timezone,
    onBlur = () => {},
    onSubmit = () => {}
  } = props

  const defaultTime = epochAsString(epoch, timezone, format)
  const inputRef = useRef(null)

  const handleOnSubmit = event => {
    event.preventDefault()
    event.stopPropagation()

    const timeValue = inputRef.current.value
    if (timeValue !== defaultTime) {
      if (moment(timeValue, format).isValid()) {
        // Retain date and update time
        const originalDate = moment(epoch).tz(timezone)
        const newTime = moment(timeValue, format)
        const newDateTime = originalDate
          .hours(newTime.hours())
          .minutes(newTime.minutes())
          .seconds(newTime.seconds())
          .milliseconds(newTime.milliseconds())
          .clone()

        onSubmit(newDateTime.valueOf())
      } else {
        console.warn(`Invalid time value submitted, expected format: ${format}`)
      }
    }
    inputRef.current.blur()
  }

  const handleOnKeyUp = event => {
    if (event.keyCode === 27) {
      event.preventDefault()
      event.stopPropagation()
      inputRef.current.blur()
    }
  }

  const handleOnBlur = event => {
    onBlur(event)
  }

  useEffect(() => {
    if (inputRef && inputRef.hasOwnProperty("current")) {
      inputRef.current.onkeyup = handleOnKeyUp
      inputRef.current.onblur = handleOnBlur
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Control
        ref={inputRef}
        name="time"
        size="md"
        type="text"
        defaultValue={defaultTime}
      />
    </Form>
  )
}

function TimezoneText(props) {
  const { timezone } = useSettings()

  const Wrapper = props.as || "React.Fragment"
  const { epoch, format, ...otherProps } = props

  if (!epoch) {
    return <Wrapper {...otherProps}>loading...</Wrapper>
  }

  return (
    <Wrapper {...otherProps}>
      {moment(epoch)
        .tz(timezone)
        .format(format)}
    </Wrapper>
  )
}

export { TimezoneText, TimezoneEditable }
