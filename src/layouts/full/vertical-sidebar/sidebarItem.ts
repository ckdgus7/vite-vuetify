import {
  BrandChromeIcon,
  BugIcon,
  CircleIcon,
  DashboardIcon,
  HelpIcon,
  KeyIcon,
  PaletteIcon,
  ShadowIcon,
  TypographyIcon,
  WindmillIcon,
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
        title: 'Diagram',
        icon: CircleIcon,
        to: '/diagram',
      },
      {
        title: 'Office',
        icon: CircleIcon,
        to: '/office',
      },
    ],
  },
  { divider: true },
  { header: 'Pages' },
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
