// @mui
import { Container, Grid, Typography } from '@mui/material';
// hooks
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import AnalyticsVideoUpdate from '../../sections/analytics/AnalyticsVideoUpdate';
import { getSimStatisticAPI } from '../../service/sim/sim.statistic.service';
// components
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';
import AnalyticsWidgetSummary from '../../sections/analytics/AnalyticsWidgetSummary';
// sections

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [statistic, setStatistic] = useState({ totalSim: 0, totalPrice: 0, totalCommission: 0, totalOrder: 0 });

  const getData = async () => {
    const resp = await getSimStatisticAPI();

    if (resp.code === '200') setStatistic(resp.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Page title={translate('menu.dashboard')}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Chào mừng bạn đến với SIM68.NET !
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('menu.totalSim')}
              total={statistic.totalSim}
              icon={'material-symbols:slow-motion-video'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('menu.totalPrice')}
              total={statistic.totalPrice}
              color="warning"
              icon={'ic:baseline-access-time'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('menu.totalOrder')}
              total={statistic.totalOrder}
              color="error"
              icon={'ic:outline-remove-red-eye'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('menu.totalCommission')}
              total={statistic.totalCommission}
              color="info"
              icon={'mdi:user-group'}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <AnalyticsVideoUpdate />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
