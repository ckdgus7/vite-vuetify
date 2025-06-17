import {
  CircleIcon,
  DashboardIcon,
  KeyIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Default',
    icon: DashboardIcon,
    to: '/dashboard/default',
  },
  { divider: true },
  { header: 'Admin' },
  {
    title: '템플릿 관리',
    icon: KeyIcon,
    children: [
      {
        title: 'Draw.io',
        icon: CircleIcon,
        to: '/admin/diagram/drawio',
      },
      {
        title: 'BPMN',
        icon: CircleIcon,
        to: '/admin/diagram/bpmn',
      },
      {
        title: 'PlantUML',
        icon: CircleIcon,
        to: '/admin/diagram/plant-uml',
      },
    ],
  },
  { divider: true },
  { header: 'Editor' },
  {
    title: 'Diagrams',
    icon: KeyIcon,
    children: [
      {
        title: 'Draw.io',
        icon: CircleIcon,
        to: '/diagram/drawio',
      },
      {
        title: 'BpmN',
        icon: CircleIcon,
        to: '/diagram/bpmn',
      },
      {
        title: 'PlantUML',
        icon: CircleIcon,
        to: '/diagram/plant-uml',
      },
    ],
  },
  {
    title: 'Rich Text Editor',
    icon: KeyIcon,
    children: [
      {
        title: 'editor1',
        icon: CircleIcon,
        to: '/rich-text-editor/editor1',
      },
      {
        title: 'editor2',
        icon: CircleIcon,
        to: '/rich-text-editor/editor2',
      },
    ],
  },
  { divider: true },
  { header: 'Grid' },
  {
    title: 'Grid',
    icon: KeyIcon,
    children: [
      {
        title: 'tui-grid',
        icon: CircleIcon,
        to: '/grid/tui-grid',
      },
    ],
  },
  // {
  //   title: 'Sample Page',
  //   icon: BrandChromeIcon,
  //   to: '/starter',
  // },
  // {
  //   title: 'Error 404',
  //   icon: BugIcon,
  //   to: '/error',
  // },
  // { divider: true },
  // { header: 'Utilities' },
  // {
  //   title: 'Typography',
  //   icon: TypographyIcon,
  //   to: '/utils/typography',
  // },
  // {
  //   title: 'Shadows',
  //   icon: ShadowIcon,
  //   to: '/utils/shadows',
  // },
  // {
  //   title: 'Colors',
  //   icon: PaletteIcon,
  //   to: '/utils/colors',
  // },
];

export default sidebarItem;
