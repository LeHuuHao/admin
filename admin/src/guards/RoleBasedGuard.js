import { Alert, AlertTitle, Container } from '@mui/material';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['ROLE_ADMIN', 'ROLE_EDITOR','ROLE_MANAGER']
  children: PropTypes.node
};

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role?.name;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();
  const { translate } = useLocales();

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>{translate("message.permissionDeny")}</AlertTitle>
          {translate("message.permissionDenyDescription")}
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
