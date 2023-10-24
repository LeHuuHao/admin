import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Avatar, Button, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { mediaBaseURL } from '../../../config';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFRadioGroup,
  RHFTextField
} from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';
import { getMediaRoles, setMediaRoleSearch } from '../../../redux/slices/sim/sim.role';
import { resetMediaUserPasswordAPI, updateMediaUserEmailAPI, updateMediaUserInfoAPI, updateMediaUserPhoneAPI, updateMediaUserRoleAPI, updateMediaUserStatusAPI } from '../../../service/sim/sim.user.service';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------


UserEditForm.propTypes = {
  isEditRole: PropTypes.bool,
  isEditPhone: PropTypes.bool,
  isEditEmail: PropTypes.bool,
  isEditInfo: PropTypes.bool,
  isEditStatus: PropTypes.bool,
  isView: PropTypes.bool,
  isResetPassword: PropTypes.bool,
  currentUser: PropTypes.object,
};

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

export default function UserEditForm({ isEditRole, isEditEmail, isEditPhone, isEditInfo, isEditStatus, isView, isResetPassword, currentUser }) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const { roles, search: searchRole, isLoading: isLoadingRole } = useSelector((state) => state.mediaRole);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaRoles());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterRole = (value) => {
    dispatch(setMediaRoleSearch({ ...searchRole, value }));
  };

  const { enqueueSnackbar } = useSnackbar();

  const validateEmail = (email) => (String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));

  const NewAccountSchema = Yup.object().shape({
    name: Yup.string().required(translate('validation.required')),
    role: Yup.object().required(translate('validation.required')),
    email: Yup.string().test('required', translate('validation.emailError'), (value) => (!isEditEmail || validateEmail(value))),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      photoURL: currentUser?.photoURL || '',
      role: currentUser?.role || null,
      email: currentUser?.email || '',
      enabled: currentUser?.enabled ? STATUS_OPTIONS[0] : STATUS_OPTIONS[1],
      id: currentUser?.id || '',
      note: currentUser?.note || '',
      website: currentUser?.website || '',
      address: currentUser?.address || '',
      birthdate: currentUser?.birthdate || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewAccountSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let resp;
    // update status
    data.enabled = data.enabled === STATUS_OPTIONS[0];

    if (isEditRole)
      resp = await updateMediaUserRoleAPI(data);
    else if (isEditStatus)
      resp = await updateMediaUserStatusAPI(data);
    else if (isResetPassword)
      resp = await resetMediaUserPasswordAPI(data);
    else if (isEditEmail)
      resp = await updateMediaUserEmailAPI(data);
    else if (isEditPhone)
      resp = await updateMediaUserPhoneAPI(data);
    else if (isEditInfo)
      resp = await updateMediaUserInfoAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.users);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Avatar alt={currentUser?.name} title={currentUser?.name} src={`${mediaBaseURL}/media/download/${currentUser?.photoURL}`} />
              <RHFTextField name="name" label={translate('media.user.name')} disabled={!isEditInfo} />
              <RHFTextField name="password" type="password" label={translate('media.user.password')} disabled={!isResetPassword} />
              <RHFTextField name="email" label={translate('media.user.email')} disabled={!isEditEmail} />
              <RHFTextField name="phone" label={translate('media.user.phone')} disabled={!isEditPhone} />
              <div>
                <LabelStyle>{translate('media.user.disabled')}</LabelStyle>
                <RHFRadioGroup
                  disabled={!isEditStatus}
                  name="enabled"
                  options={STATUS_OPTIONS}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 4 },
                  }}
                />
              </div>

              <Controller
                name="role"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    disabled={!isEditRole}
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
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <RHFTextField name="address" label={translate('media.user.address')} disabled={!isEditInfo} />
                <RHFTextField name="website" label={translate('media.user.website')} disabled={!isEditInfo} />
                <RHFTextField name="birthdate" label={translate('media.user.birthdate')} disabled={!isEditInfo} />
                <RHFTextField name="note" multiline rows={4} label={translate('media.user.note')} disabled={!isEditInfo} />
              </Stack>
            </Card>
            {isView ? <Button type='button' size="large" variant="outlined" onClick={() => navigate(-1)}>
              {translate('button.goBack')}
            </Button> :
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {translate('button.save')}
              </LoadingButton>
            }
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
