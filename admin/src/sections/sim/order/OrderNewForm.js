import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fCurrency } from '../../../utils/formatNumber';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { createOrderAPI } from '../../../service/sim/sim.order.service';

// ----------------------------------------------------------------------

OrderNewForm.propTypes = {
  currentItem: PropTypes.object,
};

export default function OrderNewForm({ currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const NewItemSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
      phone: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    data.sim = currentItem;
    const resp = await createOrderAPI(data);
    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.createSuccess'));
      navigate(PATH_DASHBOARD.sim.orders);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant='subtitle1' color={"primary"}>
                {currentItem?.phoneNo}
              </Typography>
              <Typography variant='body1'>
                {translate('sim.order.unitPrice')}: {fCurrency(currentItem?.price)}
              </Typography>
              <Typography variant='body1'>
                {translate('sim.order.interestProfit')}: {fCurrency(currentItem?.interestProfit)}
              </Typography>
              <RHFTextField name="phone" label={translate('sim.order.phone')} />
              <RHFTextField name="note" multiline rows={4} label={translate('sim.order.note')} />
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {translate('button.save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
