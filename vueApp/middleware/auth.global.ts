export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  try {
    const auth = useAuthStore()

    // Load auth if not yet loaded
    if (!auth.accessToken) {
      auth.loadAuth()
    }

    const isLoggedIn = !!auth.accessToken
    const publicRoutes = ['/login', '/forgot-password']
    const path = to?.path || ''

    // ✅ Allow ACME challenges
    if (path.startsWith('/.well-known')) return

    // ✅ Allow reset-password with uid/token
    if (path.startsWith('/reset-password')) return

    // Not logged in → redirect to login (unless public route)
    if (!isLoggedIn && !publicRoutes.includes(path)) {
      return navigateTo('/login')
    }

    // Logged in → don’t allow public routes
    if (isLoggedIn && (publicRoutes.includes(path) || path.startsWith('/reset-password'))) {
      return navigateTo('/dashboard')
    }
  } catch (err) {
    console.error('🔥 Middleware crash:', err)
  }
})
