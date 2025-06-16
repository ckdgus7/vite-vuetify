const MainRoutes = {
  path: '/',
  meta: {
    requiresAuth: true
  },
  redirect: '/dashboard/default',
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
      name: 'Page',
      path: '/page',
      children: [
        {
          name: 'ServiceReg',
          path: '/page/service-reg',
          component: () => import('@/views/sample/page/KServiceRegPage.vue')
        },
      ]
    },
    {
      name: 'Diagram',
      path: '/diagram/',
      children: [
        {
          name: 'Drawio',
          path: '/diagram/drawio',
          component: () => import('@/views/sample/diagram/RDrawioPage.vue')
        },
        {
          name: 'Bpmn',
          path: '/diagram/bpmn',
          component: () => import('@/views/sample/diagram/KBpmnPage.vue')
        },
        {
          name: 'PlantUml',
          path: '/diagram/plant-uml',
          component: () => import('@/views/sample/diagram/KPlantUmlPage.vue')
        }
      ]
    },
    {
      name: 'RichTextEditor',
      path: '/rich-text-editor',
      children: [
        {
          name: 'Editor1',
          path: '/rich-text-editor/editor1',
          component: () => import('@/views/sample/rich-text-editor/REditor1.vue')
        },
        {
          name: 'Editor2',
          path: '/rich-text-editor/editor2',
          component: () => import('@/views/sample/rich-text-editor/REditor2.vue')
        }
      ]
    },
    {
      name: 'Grid',
      path: '/grid',
      children: [
        {
          name: 'Grid1',
          path: '/grid/tui-grid',
          component: () => import('@/views/sample/grid/KTuiGridPage.vue')
        },
      ]
    },
    {
      name: 'Request',
      path: '/request-reg',
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
