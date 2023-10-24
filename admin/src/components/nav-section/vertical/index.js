import PropTypes from 'prop-types';
// @mui
import { Box, List, ListSubheader } from '@mui/material';
import { styled } from '@mui/material/styles';
//
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role?.name;
};


export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const { translate } = useLocales();
  const currentRole = useCurrentRole();

  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {translate(group.subheader)}
          </ListSubheaderStyle>

          {group.items.map((list) => (
            (list.hasRoles?.includes(currentRole) || !list.hasRoles) && <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  );
}
