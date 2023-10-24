import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { PATH_AFTER_LOGIN } from '../config';
import RoleBasedGuard from '../guards/RoleBasedGuard';


// ----------------------------------------------------------------------
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed',
            }),
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};


const UserList = Loadable(lazy(() => import('../pages/sim/user/MediaUserList')));
const UserEdit = Loadable(lazy(() => import('../pages/sim/user/MediaUserEdit')));
const MediaUserCreate = Loadable(lazy(() => import('../pages/sim/user/MediaUserCreate')));
const MediaCacheList = Loadable(lazy(() => import('../pages/sim/cache/MediaCacheList')));
const MediaCacheKeyList = Loadable(lazy(() => import('../pages/sim/cache/MediaCacheKeyList')));


const simsRoute = {
  path: 'sims',
  element: (
    <RoleBasedGuard accessibleRoles={['ROLE_ADMIN', 'ROLE_SHOP', 'ROLE_STAFF', 'ROLE_MEMBER']}>
      <Outlet />
    </RoleBasedGuard>
  ),
  children: [
    { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },

    // user
    { path: 'users', element: <UserList /> },
    { path: 'user/new', element: <MediaUserCreate /> },
    { path: 'user/:id/view', element: <UserEdit /> },
    { path: 'user/:id/edit/role', element: <UserEdit /> },
    { path: 'user/:id/edit/email', element: <UserEdit /> },
    { path: 'user/:id/edit/phone', element: <UserEdit /> },
    { path: 'user/:id/edit/status', element: <UserEdit /> },
    { path: 'user/:id/edit/uid', element: <UserEdit /> },
    { path: 'user/:id/edit/info', element: <UserEdit /> },
    { path: 'user/:id/reset/password', element: <UserEdit /> },

    // cache
    { path: 'caches', element: <MediaCacheList /> },
    { path: 'cache/:name/keys', element: <MediaCacheKeyList /> },
  ],
};

export default simsRoute;
