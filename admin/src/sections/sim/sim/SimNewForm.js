import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Chip, Grid, Stack, TextField, Typography, styled } from '@mui/material';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import { getCategories, setCategorySearch } from '../../../redux/slices/sim/sim.category';
import { getOperators, setOperatorSearch } from '../../../redux/slices/sim/sim.operator';
import { dispatch, useSelector } from '../../../redux/store';
import { createSimAPI, updateSimAPI } from '../../../service/sim/sim.sim.service';
import { roles } from '../../../utils/roles';

// ----------------------------------------------------------------------

SimNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));


const STATUS_OPTIONS = ["ACTIVE", "HOLD", "SOLD"];

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role?.name;
};

export default function SimNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const currentRole = useCurrentRole();

  const { operators, search: searchOperator, isLoading: isLoadingOperator } = useSelector((state) => state.operator);
  const { categories, search: searchCategory, isLoading: isLoadingCategory } = useSelector((state) => state.category);

  const NewItemSchema = Yup.object().shape({
    phoneNo: Yup.string().required(translate('validation.required')),
    price: Yup.string().required(translate('validation.required')),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getOperators());
      dispatch(getCategories());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchOperator, searchCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterTitleCategory = (value) => {
    dispatch(setCategorySearch({ ...searchCategory, value }));
  };

  const handleFilterTitleOperator = (value) => {
    dispatch(setOperatorSearch({ ...searchOperator, value }));
  };

  const defaultValues = useMemo(
    () => ({
      id: currentItem?.id || '',
      phoneNo: currentItem?.phoneNo || '',
      price: currentItem?.price || '0',
      categories: currentItem?.categories || [],
      operator: currentItem?.operator || null,
      status: currentItem?.status || STATUS_OPTIONS[0]
    }),
    [currentItem]
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
    console.log(data);
    let resp;
    if (isEdit) resp = await updateSimAPI(data);
    else resp = await createSimAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.sims);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={2}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="phoneNo" label={translate('sim.sim.phoneNo')} disabled={isView || isEdit} />
                <RHFTextField name="price" label={translate('sim.sim.price')} disabled={isView} />
                {(isEdit || isView) && <>
                  <Controller
                    name="operator"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        disabled={isView}
                        fullWidth
                        {...field}
                        onChange={(___, newValue) => field.onChange(newValue)}
                        options={operators?.map(({ id, title }) => ({ id, title }))}
                        getOptionLabel={(option) => option.title || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        loading={isLoadingOperator}
                        onInputChange={(event, value) => {
                          handleFilterTitleOperator(value);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.title} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            label={translate('sim.sim.operator')}
                            {...params}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="categories"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        disabled={isView}
                        fullWidth
                        {...field}
                        multiple
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={categories?.map(({ id, title }) => ({ id, title }))}
                        getOptionLabel={(option) => option.title || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        loading={isLoadingCategory}
                        onInputChange={(event, value) => {
                          handleFilterTitleCategory(value);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.title} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            label={translate('sim.sim.categories')}
                            {...params}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                  {currentRole === roles.ROLE_ADMIN &&
                    <div>
                      <LabelStyle>{translate('sim.sim.status')}</LabelStyle>
                      <RHFRadioGroup
                        disabled={isView}
                        name="status"
                        options={STATUS_OPTIONS}
                        sx={{
                          '& .MuiFormControlLabel-root': { mr: 4 },
                        }}
                      />
                    </div>}
                </>
                }
                {isView ? (
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.sim.root}/sim/${currentItem?.id}/edit`}
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
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
