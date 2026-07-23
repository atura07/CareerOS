import axios from 'axios'

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Attach JWT token from localStorage to every authenticated request
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

