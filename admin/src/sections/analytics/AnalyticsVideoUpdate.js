// @mui
import { Box, Button, Card, CardHeader, Divider, Stack, Typography } from '@mui/material';
// utils
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import useLocales from '../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../routes/paths';

// ---
export default function AnalyticsVideoUpdate() {
  const { translate } = useLocales();
  const { sims } = useSelector((state) => state.sim);

  return (
    <Card>
      <CardHeader title={translate('sim.sim.listSim')} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {sims.map((v) => (
            <SimItem key={v.id} item={v} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'left' }}>
        <Button size="small" LinkComponent={Link} to={PATH_DASHBOARD.sim.sims} color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          {translate('button.preview')}
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
function SimItem({ item }) {
  // eslint-disable-next-line react/prop-types
  const { phoneNo, createdAt, status } = item;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240 }}>
        <Typography variant="subtitle2" noWrap>
          {phoneNo}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {status}
      </Typography>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {createdAt}
      </Typography>
    </Stack>
  );
}
