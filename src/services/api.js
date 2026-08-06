import axios from 'axios'
import { startLoading, stopLoading } from '../utils/loading'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request Interceptor (API কল শুরু হলে লোডার অন হবে)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    startLoading()

    return config
  },
  (error) => {
    stopLoading()
    return Promise.reject(error)
  },
)

// Response Interceptor (API কল শেষ বা ফেল করলে লোডার অফ হবে)
api.interceptors.response.use(
  (response) => {
    stopLoading()
    return response
  },
  (error) => {
    stopLoading()
    return Promise.reject(error)
  },
)

export default api
