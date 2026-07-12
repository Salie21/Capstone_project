const configuredApiUrl = import.meta.env.VITE_API_URL
const isLocalhostApi =
  configuredApiUrl?.includes('localhost') || configuredApiUrl?.includes('127.0.0.1')

const API_URL =
  configuredApiUrl && !(import.meta.env.PROD && isLocalhostApi)
    ? configuredApiUrl.replace(/\/$/, '')
    : import.meta.env.DEV
      ? 'http://localhost:5000'
      : ''

export default API_URL
