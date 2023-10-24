/* eslint-disable react/prop-types */
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
// routes
import { setSimSearch } from '../../../redux/slices/sim/sim.sim';
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';

import { FormProvider, RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import { createUserOrderAPI, updateUserOrderAPI } from '../../../service/sim/sim.user-order.service';
import { useDispatch, useSelector } from '../../../redux/store';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

UserOrderNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

const STATUS_OPTIONS = ["NEW", "DONE", "CANCEL"];

export default function UserOrderNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const { sims, search: searchSim, isLoading: isLoadingSim } = useSelector((state) => state.sim);

  const handleFilterSim = (value) => {
    dispatch(setSimSearch({ ...searchSim, value }));
  };

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required(translate('validation.required')),
    phone: Yup.string().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      address: currentItem?.address || '',
      name: currentItem?.name || '',
      id: currentItem?.id || '',
      status: currentItem?.status || STATUS_OPTIONS[0],
      note: currentItem?.note || '',
      phone: currentItem?.phone || '',
      simNumber: currentItem?.simNumber || '',
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
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let resp;
    if (isEdit) resp = await updateUserOrderAPI(data);
    else resp = await createUserOrderAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.userOrders);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Controller
                name="simNumber"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={sims.map(({ id, phoneNo }) => ({ id, phoneNo }))}
                    getOptionLabel={(option) => option?.phoneNo || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={isLoadingSim}
                    onInputChange={(event, value) => {
                      handleFilterSim(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option?.phoneNo} />
                      ))
                    }
                    renderInput={(params) => <TextField label={translate('sim.userOrder.simNumber')} {...params} />}
                  />
                )}
              />
              <RHFTextField name="phone" disabled={isView} label={translate('sim.userOrder.phone')} />
              <RHFTextField name="name" disabled={isView} label={translate('sim.userOrder.name')} />
              <RHFTextField name="address" disabled={isView} label={translate('sim.userOrder.address')} />
              <RHFTextField name="note" disabled={isView} label={translate('sim.userOrder.note')} />

              <div>
                <LabelStyle>{translate('sim.userOrder.status')}</LabelStyle>
                <RHFRadioGroup
                  disabled={isView}
                  name="status"
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
                  to={`${PATH_DASHBOARD.sim.root}/user-order/${currentItem?.id}/edit`}
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
