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
  { header: 'Editor' },
  {
    title: 'Diagrams',
    icon: KeyIcon,
    to: '/diagrams',
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
    to: 'rech-text-editor',
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
    to: '/grid',
    children: [
      {
        title: 'tui-grid',
        icon: CircleIcon,
        to: '/grid/tui-grid',
      },
    ],
  },
  { divider: true },
  { header: 'Pages' },
  {
    title: '요구사항등록',
    icon: KeyIcon,
    to: '/page/service-reg',
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
