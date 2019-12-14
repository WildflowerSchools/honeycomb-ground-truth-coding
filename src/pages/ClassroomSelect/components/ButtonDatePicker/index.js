import React from "react"

import { Button } from "react-bootstrap"
import DatePicker from "react-datepicker"

// DatePicker requires ButtonWrapper to be a class component
class ButtonWrapper extends React.Component {
  render() {
    return (
      <Button onClick={this.props.onClick}>
        {this.props.value || this.props.placeholder}
      </Button>
    )
  }
}

function Index(props) {
  const { ...other } = props

  return <DatePicker {...other} customInput={<ButtonWrapper />} />
}

export default Index
