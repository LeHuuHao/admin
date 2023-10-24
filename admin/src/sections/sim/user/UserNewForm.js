import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import { getMediaRoles, setMediaRoleSearch } from '../../../redux/slices/sim/sim.role';
import { dispatch, useSelector } from '../../../redux/store';
import { createMediaUserAPI } from '../../../service/sim/sim.user.service';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

export default function UserNewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const { roles, search: searchRole, isLoading: isLoadingRole } = useSelector((state) => state.mediaRole);

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required(translate('validation.required')),
    role: Yup.object().required(translate('validation.required')),
    username: Yup.string().required(translate('validation.required')),
    password: Yup.string().required(translate('validation.required')),
    phone: Yup.string().required(translate('validation.required')),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaRoles());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterRole = (value) => {
    dispatch(setMediaRoleSearch({ ...searchRole, value }));
  };

  const defaultValues = useMemo(
    () => ({
      enabled: STATUS_OPTIONS[0],
      name: '',
      role: null,
      username: '',
      password: '',
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
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    data.enabled = data.enabled === STATUS_OPTIONS[0];
    const resp = await createMediaUserAPI(data);
    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.createSuccess'));
      navigate(PATH_DASHBOARD.sim.users);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="username" label={translate('media.user.username')} />
              <RHFTextField name="password" type="password" label={translate('media.user.password')} />
              <RHFTextField name="name" label={translate('media.user.name')} />
              <RHFTextField name="phone" label={translate('media.user.phone')} />
              <Controller
                name="role"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    options={roles.map(({ id, name }) => ({ id, name }))}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={isLoadingRole}
                    onInputChange={(_, value) => {
                      handleFilterRole(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.name} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label={translate('media.user.roles')}
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <div>
                <LabelStyle>{translate('media.user.disabled')}</LabelStyle>
                <RHFRadioGroup
                  name="enabled"
                  options={STATUS_OPTIONS}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 4 },
                  }}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <RHFTextField name="email" label={translate('media.user.email')} />
                <RHFTextField name="address" label={translate('media.user.address')} />
                <RHFTextField name="website" label={translate('media.user.website')} />
                <RHFTextField name="birthdate" label={translate('media.user.birthdate')} />
                <RHFTextField name="note" multiline rows={4} label={translate('media.user.note')} />
              </Stack>
            </Card>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {translate('button.new')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
