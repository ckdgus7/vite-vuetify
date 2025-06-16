const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [

    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Diagram',
      path: '/diagram',
      component: () => import('@/views/diagram/ShadowPage.vue')
    },
    {
      name: 'Office',
      path: '/office',
      component: () => import('@/views/office/ShadowPage.vue')
    },
    {
      name: 'Request',
      path: '/request',
      component: () => import('@/views/RequestPage.vue')
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue')
    },
    {
      name: 'Typography',
      path: '/utils/typography',
      component: () => import('@/views/utilities/typography/TypographyPage.vue')
    },
    {
      name: 'Shadows',
      path: '/utils/shadows',
      component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    },
    {
      name: 'Colors',
      path: '/utils/colors',
      component: () => import('@/views/utilities/colors/ColorPage.vue')
    }
  ]
};

export default MainRoutes;
