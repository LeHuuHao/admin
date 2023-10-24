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
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { createEmailAPI, updateEmailAPI } from '../../../service/sim/sim.email.service';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

EmailNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

export default function EmailNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const NewItemSchema = Yup.object().shape({
    email: Yup.string().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      email: currentItem?.email || '',
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
    let resp;
    if (isEdit) resp = await updateEmailAPI(data);
    else resp = await createEmailAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.emails);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <LabelStyle>{translate('sim.email.email')}</LabelStyle>
                <RHFTextField name="email" label={translate('sim.email.email')} disabled={isView} />
              </div>
              {isView ? (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.sim.root}/email/${currentItem?.id}/edit`}
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
