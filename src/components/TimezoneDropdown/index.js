import React, { useState } from "react"

import { Dropdown, FormControl } from "react-bootstrap"
import { useSettings } from "../../settings"

import moment from "../../utils/moment"

import "./style.css"

function Index(props) {
  const { timezone, setTimezone } = useSettings()

  const timezones = moment.tz.names().map((timezone, _) => {
    const abbr = moment.tz(timezone).zoneAbbr()
    const zoneName = moment.tz(timezone).zoneName()
    const utc = `UTC${moment.tz(timezone).format("ZZ")}`

    return {
      search: `${timezone} ${timezone.replace(
        "_",
        " "
      )} ${abbr} ${zoneName} ${utc}}`,
      title: timezone,
      timezone: timezone,
      details: `${abbr} | (${utc}) - ${zoneName}`
    }
  })

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      className="dropdown-toggle"
      // data-display="static"
      onClick={e => {
        e.preventDefault()
        onClick(e)
      }}
    >
      {children}
    </a>
  ))

  const CustomMenu = React.forwardRef(
    (
      {
        children,
        style,
        className,
        "aria-labelledby": labeledBy,
        filterdefault
      },
      ref
    ) => {
      const [filter, setFilter] = useState(filterdefault)

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto fill-available"
            placeholder="Type to filter..."
            onChange={e => setFilter(e.target.value)}
            value={filter}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              child =>
                !filter ||
                child.props.timezone.search.toLowerCase().indexOf(filter) !== -1
            )}
          </ul>
        </div>
      )
    }
  )

  return (
    <Dropdown {...props}>
      <Dropdown.Toggle as={CustomToggle} /*data-display="static"*/>
        {timezone || "Select Timezone"}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="timezone-dropdown-menu"
        as={
          CustomMenu
        } /*popperConfig={{placement: 'bottom', positionFixed: true}}*/
      >
        {timezones.map((tz, idx) => {
          return (
            <Dropdown.Item
              key={idx}
              timezone={tz}
              filterdefault={timezone}
              onSelect={() => {
                setTimezone(tz.timezone)
              }}
            >
              <div>
                <h5>{tz.title}</h5>
                <h6 className="mb-2 text-muted">{tz.details}</h6>
              </div>
            </Dropdown.Item>
          )
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Index
