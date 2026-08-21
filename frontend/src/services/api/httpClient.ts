import axios from 'axios'

export const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 30000,
})

// Attach the backend (Spring Boot) JWT to authenticated requests only.
const BACKEND_TOKEN_KEY = 'auth_token'

httpClient.interceptors.request.use(
  (config) => {
    // Never attach Authorization header to public auth endpoints
    const isPublicAuth = config.url?.includes('/v1/auth/')
    if (isPublicAuth) {
      if (config.headers) {
        delete config.headers.Authorization
      }
      return config
    }

    const token = localStorage.getItem(BACKEND_TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

