import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import {
  Button,
  Card,
  Grid,
  Stack
} from '@mui/material';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import useLocales from '../../hooks/useLocales';
import { updateMediaUserPasswordAPI } from '../../service/sim/sim.user.service';

// ----------------------------------------------------------------------

export default function ChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const UpdateUserSchema = Yup.object().shape({
    oldPassword: Yup.string().required(translate('validation.required')),
    password: Yup.string().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      oldPassword: '',
      password: ''
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const resp = await updateMediaUserPasswordAPI(data);
    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.updateSuccess'));
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="oldPassword" label={translate('media.user.oldPassword')} />
              <RHFTextField name="password" label={translate('media.user.password')} />
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {translate('button.save')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
