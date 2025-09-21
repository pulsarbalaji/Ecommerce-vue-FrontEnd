// router.options.js
export default {
  routes: scannedRoutes => [
    ...scannedRoutes,
    {
      path: '/',
      name: 'index',
      redirect: '/login',  
    },
  ],
}
