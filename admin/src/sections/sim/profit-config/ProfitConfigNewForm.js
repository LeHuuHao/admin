import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, Stack } from '@mui/material';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { getSlug } from '../../../utils/urlSlug';
import { createProfitConfigAPI, updateProfitConfigAPI } from '../../../service/sim/sim.profit-config.service';


// ----------------------------------------------------------------------

ProfitConfigNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

export default function ProfitConfigNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();


  const NewItemSchema = Yup.object().shape({
    
  });

  const defaultValues = useMemo(
    () => ({
      fromPercent: currentItem?.fromPercent || '',
      toPercent: currentItem?.toPercent || '',
      profitPercent: currentItem?.profitPercent || '',
      id: currentItem?.id || '',
      createdAt: currentItem?.createdAt || '',
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const subscription = watch((value, { title }) => {
      if (title === 'title') {
        setValue('metaTitle', value.title, { shouldValidate: true });
        setValue('slug', getSlug(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    let resp;
    if (isEdit) resp = await updateProfitConfigAPI(data);
    else resp = await createProfitConfigAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.profitConfigs);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="fromPercent" label={translate('sim.profitConfig.fromPercent')} disabled={isView} />
              <RHFTextField name="toPercent" label={translate('sim.profitConfig.toPercent')} disabled={isView} />
              <RHFTextField name="profitPercent" label={translate('sim.profitConfig.profitPercent')} disabled={isView} />
              {isView ? (
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.sim.root}/profit-config/${currentItem?.id}/edit`}
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
