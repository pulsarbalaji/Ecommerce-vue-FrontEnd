export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  try {
    const auth = useAuthStore()

    // Wait until auth is loaded from sessionStorage
    if (!auth.accessToken) {
      await new Promise<void>((resolve) => {
        auth.loadAuth()
        resolve()
      })
    }

    const isLoggedIn = !!auth.accessToken
    const publicRoutes = ['/login', '/forgot-password', '/reset-password']
    const path = to?.path || ''

    if (path.startsWith('/.well-known')) return

    if (!isLoggedIn && !publicRoutes.includes(path)) {
      return navigateTo('/login')
    }

    if (isLoggedIn && publicRoutes.includes(path)) {
      return navigateTo('/dashboard')
    }
  } catch (err) {
    console.error('🔥 Middleware crash:', err)
  }
})
