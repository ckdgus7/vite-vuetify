import {
  BrandChromeIcon,
  BugIcon,
  CircleIcon,
  DashboardIcon,
  KeyIcon,
  PaletteIcon,
  ShadowIcon,
  TypographyIcon
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
  {
    title: 'Editor',
    icon: KeyIcon,
    to: '/auth',
    children: [
      {
        title: 'Draw.io',
        icon: CircleIcon,
        to: '/draw-io',
      },
      {
        title: 'BPMN',
        icon: CircleIcon,
        to: '/bpmn',
      },
      {
        title: 'PUML',
        icon: CircleIcon,
        to: '/puml',
      },
    ],
  },
  { divider: true },
  {
    title: 'Grid',
    icon: KeyIcon,
    to: '/grid',
    children: [
      {
        title: 'NHN tui-grid',
        icon: CircleIcon,
        to: '/tui-grid',
      },
    ],
  },
  { divider: true },
  { header: 'Pages' },
  {
    title: '요구사항 등록',
    icon: BrandChromeIcon,
    to: '/request',
  },
  {
    title: 'Sample Page',
    icon: BrandChromeIcon,
    to: '/starter',
  },
  {
    title: 'Error 404',
    icon: BugIcon,
    to: '/error',
  },
  { divider: true },
  { header: 'Utilities' },
  {
    title: 'Typography',
    icon: TypographyIcon,
    to: '/utils/typography',
  },
  {
    title: 'Shadows',
    icon: ShadowIcon,
    to: '/utils/shadows',
  },
  {
    title: 'Colors',
    icon: PaletteIcon,
    to: '/utils/colors',
  },
];

export default sidebarItem;
