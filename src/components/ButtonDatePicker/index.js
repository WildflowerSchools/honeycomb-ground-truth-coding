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

const Index = React.forwardRef((props, ref) => {
  const { ...other } = props

  return <DatePicker ref={ref} {...other} customInput={<ButtonWrapper />} />
})

export default Index
