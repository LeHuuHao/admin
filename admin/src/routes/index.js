import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';
import { PATH_AFTER_LOGIN } from '../config';
import AccountGeneral from '../pages/dashboard/AccountGeneral';

import LoadingScreen from '../components/LoadingScreen';
import AuthGuard from '../guards/AuthGuard';
// guards
import GuestGuard from '../guards/GuestGuard';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import ChangePassword from '../pages/dashboard/ChangePassword';
import simsRoute from './sim.route';

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
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      element: (
        <GuestGuard>
          <Outlet />
        </GuestGuard>
      ),
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> }
      ]
    },
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'profile', element: <AccountGeneral /> },
        { path: 'change-password', element: <ChangePassword /> },
        simsRoute
      ]
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    }
  ]);
}
// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));

// Main
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
