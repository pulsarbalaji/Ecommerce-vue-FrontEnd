import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const admin = ref<any>(null)

  // Set auth after login
  function setAuth(token: string, userData: any) {
    accessToken.value = token
    admin.value = userData
    sessionStorage.setItem('access_token', token)
    sessionStorage.setItem('admin', JSON.stringify(userData))
  }

  // Load from sessionStorage (on refresh)
  function loadAuth() {
    const token = sessionStorage.getItem('access_token')
    const user = sessionStorage.getItem('admin')
    if (token) accessToken.value = token
    if (user) admin.value = JSON.parse(user)
  }

  // Clear on logout
  function clearAuth() {
    accessToken.value = null
    admin.value = null
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('admin')
  }

  return { accessToken, admin, setAuth, loadAuth, clearAuth }
})
