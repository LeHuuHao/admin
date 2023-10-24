import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import { mediaBaseURL } from '../../config';
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../routes/paths';
import { updateMediaUserInfoAPI, updateUserAvatarAPI } from '../../service/sim/sim.user.service';
import { resizeFile } from '../../utils/FileUtils';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({

  });

  const defaultValues = useMemo(
    () => ({
      ...user,
      file: `${mediaBaseURL}/media/download/${user?.photoURL}`,
    }),
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'file',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const newFile = await resizeFile(file, 500, 500);

        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("id", user?.id);

        const resp = await updateUserAvatarAPI(formData);
        if (resp.code === '200') {
          enqueueSnackbar(translate('message.createSuccess'));
        } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
      }
    },
    [enqueueSnackbar, setValue, translate, user?.id]
  );


  const onSubmit = async (data) => {
    const resp = await updateMediaUserInfoAPI(data);
    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.updateSuccess'));
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="file"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {user?.username}
                  <br />
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.root}/change-password`}
                    size="small"
                  >
                    Đổi mật khẩu
                  </Button>
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="email" label={translate('media.user.email')} disabled />
              <RHFTextField name="phone" label={translate('media.user.phone')} disabled />
              <RHFTextField name="name" label={translate('media.user.name')} />
              <RHFTextField name="address" label={translate('media.user.address')} />
              <RHFTextField name="website" label={translate('media.user.website')} />
              <RHFTextField name="birthdate" label={translate('media.user.birthdate')} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="note" multiline rows={4} label={translate('media.user.note')} />
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
