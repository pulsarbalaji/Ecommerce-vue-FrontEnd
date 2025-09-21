import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // change your baseURL
  })

  // Attach token before every request
  api.interceptors.request.use((config) => {
    const auth = useAuthStore()
    if (!auth.accessToken) {
      auth.loadAuth() // reload from session if lost
    }
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    return config
  })

  return {
    provide: { api },
  }
})
