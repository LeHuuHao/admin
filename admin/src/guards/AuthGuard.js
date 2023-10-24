import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
// components

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to='/auth/login'  />;
  }
  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }
  return <>{children}</>;
}
