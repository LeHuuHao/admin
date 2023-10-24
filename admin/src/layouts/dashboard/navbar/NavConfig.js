// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------
const getIcon = (name) => (
  <SvgIconStyle src={`${process.env.PUBLIC_URL}/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const ICONS = {
  cache: getIcon('ic_cache'),
  video: getIcon('ic_booking'),
  user: getIcon('ic_user'),
  analytics: getIcon('ic_dashboard'),
  shop: getIcon('ic_ecommerce'),
  tag: getIcon('ic_tag'),
  tutor: getIcon('ic_tutor'),
  category: getIcon('ic_category'),
  setting: getIcon('ic_cog'),
  exam: getIcon('ic_exam'),
};
const navConfig = [
  // GENERAL
  {
    subheader: 'menu.general',
    items: [
      {
        title: 'menu.analytics',
        path: PATH_DASHBOARD.dashboard.analytics,
        icon: ICONS.analytics,
        hasRoles: ['ROLE_ADMIN'],
      },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'menu.sim',
    items: [
      {
        title: 'menu.sim',
        path: PATH_DASHBOARD.sim.sims,
        icon: ICONS.shop,
        hasRoles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_SHOP', 'ROLE_MEMBER'],
        children: [
          { title: 'menu.sims', path: PATH_DASHBOARD.sim.sims },
          { title: 'menu.order', path: PATH_DASHBOARD.sim.orders, hasRoles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_SHOP'] },
          { title: 'menu.userorder', path: PATH_DASHBOARD.sim.userOrders, hasRoles: ['ROLE_ADMIN'] },
          { title: 'menu.operator', path: PATH_DASHBOARD.sim.operators, hasRoles: ['ROLE_ADMIN'] },
          { title: 'menu.category', path: PATH_DASHBOARD.sim.categories, hasRoles: ['ROLE_ADMIN'] },
        ],
      },
      {
        title: 'menu.posts',
        path: PATH_DASHBOARD.sim.posts,
        icon: ICONS.tag,
        hasRoles: ['ROLE_ADMIN', 'ROLE_BLOG'],
        children: [
          { title: 'menu.post', path: PATH_DASHBOARD.sim.posts },
          { title: 'menu.postCategory', path: PATH_DASHBOARD.sim.postCategories },
          { title: 'menu.tag', path: PATH_DASHBOARD.sim.tags },
        ],
      },
      {
        title: 'menu.config',
        path: PATH_DASHBOARD.sim.settings,
        icon: ICONS.setting,
        hasRoles: ['ROLE_ADMIN', 'ROLE_SHOP'],
        children: [
          { title: 'menu.priceConfig', path: PATH_DASHBOARD.sim.priceConfigs },
          { title: 'menu.profitConfig', path: PATH_DASHBOARD.sim.profitConfigs, hasRoles: ['ROLE_ADMIN'] },
        ],
      },
      {
        title: 'menu.user',
        path: PATH_DASHBOARD.sim.users,
        icon: ICONS.user,
        hasRoles: ['ROLE_ADMIN'],
        children: [
          { title: 'menu.user', path: PATH_DASHBOARD.sim.users },
          { title: 'menu.privilege', path: PATH_DASHBOARD.sim.privileges },
          { title: 'menu.role', path: PATH_DASHBOARD.sim.roles },
        ],
      },
      {
        title: 'menu.setting',
        path: PATH_DASHBOARD.sim.caches,
        icon: ICONS.cache,
        hasRoles: ['ROLE_ADMIN'],
        children: [
          { title: 'menu.cache', path: PATH_DASHBOARD.sim.caches },
          { title: 'menu.email', path: PATH_DASHBOARD.sim.emails },
          { title: 'menu.report', path: PATH_DASHBOARD.sim.report },
        ],
      },
    ],
  },
];
export default navConfig;
