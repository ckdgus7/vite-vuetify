const MainRoutes = {
  path: '/',
  meta: {
    requiresAuth: true,
  },
  redirect: '/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      redirect: '/dashboard/default',
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue'),
    },
    {
      name: 'BaseComponentPage',
      path: '/base-component-page',
      children: [
        {
          name: 'BaseGridSearch',
          path: '/base-component-page/grid-search',
          component: () => import('@/views/_base-component-page/BaseGridSearch.vue'),
        },
        {
          name: 'BaseAgGrid',
          path: '/base-component-page/ag-grid',
          component: () => import('@/views/_base-component-page/BaseAgGrid.vue'),
        },
        {
          name: 'BaseCkEditor',
          path: '/base-component-page/ck-editor',
          component: () => import('@/views/_base-component-page/BaseCkEditor.vue'),
        },
      ],
    },
    {
      name: 'Admin',
      path: '/admin',
      children: [
        {
          name: 'DrawioTemplate',
          path: '/admin/diagram/drawio',
          component: () => import('@/views/sample/admin/diagram/drawio/DrawioList.vue'),
        },
        {
          name: 'DrawioTemplateView',
          path: '/admin/diagram/drawio/view/:id',
          component: () => import('@/views/sample/admin/diagram/drawio/DrawioDetail.vue'),
        },
        {
          name: 'DrawioTemplateEdit',
          path: '/admin/diagram/drawio/edit/:id',
          component: () => import('@/views/sample/admin/diagram/drawio/DrawioEdit.vue'),
        },
        {
          name: 'DrawioTemplateRegister',
          path: '/admin/diagram/drawio/register',
          component: () => import('@/views/sample/admin/diagram/drawio/DrawioPage.vue'),
        },
        {
          name: 'BpmnTemplate',
          path: '/admin/diagram/bpmn',
          component: () => import('@/views/sample/admin/diagram/bpmn/BpmnList.vue'),
        },
        {
          name: 'BpmnTemplateView',
          path: '/admin/diagram/bpmn/view/:id',
          component: () => import('@/views/sample/admin/diagram/bpmn/BpmnDetail.vue'),
        },
        {
          name: 'BpmnTemplateEdit',
          path: '/admin/diagram/bpmn/edit/:id',
          component: () => import('@/views/sample/admin/diagram/bpmn/BpmnEdit.vue'),
        },
        {
          name: 'BpmnTemplateRegister',
          path: '/admin/diagram/bpmn/register',
          component: () => import('@/views/sample/admin/diagram/bpmn/BpmnPage.vue'),
        },
        {
          name: 'PlantUmlTemplate',
          path: '/admin/diagram/plant-uml',
          component: () => import('@/views/sample/admin/diagram/puml/PlantUmlList.vue'),
        },
        {
          name: 'PlantUmlTemplateView',
          path: '/admin/diagram/plant-uml/view/:id',
          component: () => import('@/views/sample/admin/diagram/puml/PlantUmlDetail.vue'),
        },
        {
          name: 'PlantUmlTemplateEdit',
          path: '/admin/diagram/plant-uml/edit/:id',
          component: () => import('@/views/sample/admin/diagram/puml/PlantUmlEdit.vue'),
        },
        {
          name: 'PlantUmlTemplateRegister',
          path: '/admin/diagram/plant-uml/register',
          component: () => import('@/views/sample/admin/diagram/puml/PlantUmlPage.vue'),
        },
      ],
    },
    {
      name: 'Page',
      path: '/page',
      children: [
        {
          name: 'ServiceReg',
          path: '/page/service-reg',
          component: () => import('@/views/sample/page/KServiceRegPage.vue'),
        },
      ],
    },
    {
      name: 'Diagram',
      path: '/diagram/',
      children: [
        {
          name: 'Drawio',
          path: '/diagram/drawio',
          component: () => import('@/views/sample/diagram/RDrawioPage.vue'),
        },
        {
          name: 'Bpmn',
          path: '/diagram/bpmn',
          component: () => import('@/views/sample/diagram/KBpmnPage.vue'),
        },
        {
          name: 'PlantUml',
          path: '/diagram/plant-uml',
          component: () => import('@/views/sample/diagram/KPlantUmlPage.vue'),
        },
      ],
    },
    {
      name: 'RichTextEditor',
      path: '/rich-text-editor',
      children: [
        {
          name: 'Editor1',
          path: 'editor1',
          component: () => import('@/views/sample/rich-text-editor/REditor1.vue'),
        },
        {
          name: 'Editor2',
          path: 'editor2',
          component: () => import('@/views/sample/rich-text-editor/REditor2.vue'),
        },
      ],
    },
    {
      name: 'Grid',
      path: '/grid',
      children: [
        {
          name: 'Grid1',
          path: 'tui-grid',
          component: () => import('@/views/sample/grid/KTuiGridPage.vue'),
        },
      ],
    },
    {
      name: 'Request',
      path: '/request-reg',
      component: () => import('@/views/RequestPage.vue'),
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue'),
    },
    {
      name: 'Typography',
      path: '/utils/typography',
      component: () => import('@/views/utilities/typography/TypographyPage.vue'),
    },
    {
      name: 'Shadows',
      path: '/utils/shadows',
      component: () => import('@/views/utilities/shadows/ShadowPage.vue'),
    },
    {
      name: 'Colors',
      path: '/utils/colors',
      component: () => import('@/views/utilities/colors/ColorPage.vue'),
    },
  ],
};

export default MainRoutes;
