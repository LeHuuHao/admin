import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { roles } from '../../../utils/roles';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import { updateOrderAPI } from '../../../service/sim/sim.order.service';
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

OrderEditForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role?.name;
};

const STATUS_OPTIONS = ["NEW", "DONE", "CANCEL"];

export default function OrderEditForm({ currentItem, isEdit, isView }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const currentRole = useCurrentRole();

  const NewItemSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      note: currentItem?.note || '',
      phone: currentItem?.phone || '',
      statusOrder: currentItem?.statusOrder || STATUS_OPTIONS[0],
      id: currentItem?.id || '',
    }),
    [currentItem]
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
    const resp = await updateOrderAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
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
                {currentItem?.sim.phoneNo}
              </Typography>
              <Typography variant='body1'>
                {translate('sim.order.unitPrice')}: {fCurrency(currentItem?.unitPrice)}
              </Typography>
              <Typography variant='body1'>
                {translate('sim.order.interestProfit')}: {fCurrency(currentItem?.interestProfit)}
              </Typography>
              {currentRole === roles.ROLE_ADMIN &&
                <Typography variant='body1'>
                  {translate('sim.order.commission')}: {fCurrency(currentItem?.commission)}
                </Typography>
              }
              <RHFTextField name="phone" label={translate('sim.order.phone')} disabled={isView} />
              <RHFTextField name="note" multiline rows={4} label={translate('sim.order.note')} disabled={isView} />
              <div>
                <LabelStyle>{translate('sim.order.statusOrder')}</LabelStyle>
                <RHFRadioGroup
                  disabled={isView}
                  name="statusOrder"
                  options={STATUS_OPTIONS}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 4 },
                  }}
                />
              </div>
              {isView ? (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.sim.root}/order/${currentItem?.id}/edit`}
                  size="large"
                  startIcon={<Iconify icon={'eva:edit-fill'} />}
                >
                  {translate('button.edit')}
                </Button>
              ) : (
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  {!isEdit ? translate('button.new') : translate('button.save')}
                </LoadingButton>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
