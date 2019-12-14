export const combineURLs = (baseURL, relativeURL) => {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL
}
