// TODO: Consider using apollo-client's local schema for settings
import React, { useContext } from "react"
import useLocalStorage from "react-use-localstorage"

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

export const SettingsContext = React.createContext()
export const useSettings = () => useContext(SettingsContext)
export const SettingsProvider = ({ children }) => {
  const [timezone, _setTimezone] = useLocalStorage("timezone", LOCAL_TIMEZONE)

  const setTimezone = value => {
    if (!value) {
      _setTimezone(LOCAL_TIMEZONE)
    } else {
      _setTimezone(value)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        timezone,
        setTimezone
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
