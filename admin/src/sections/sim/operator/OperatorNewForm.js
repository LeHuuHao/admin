import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, Stack, styled, Typography } from '@mui/material';
import { mediaBaseURL } from '../../../config';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { createOperatorAPI, updateOperatorAPI } from '../../../service/sim/sim.operator.service';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

OperatorNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

export default function OperatorNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const NewItemSchema = Yup.object().shape({
    title: Yup.string().required(translate('validation.required')),
    fileObj: Yup.mixed().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentItem?.title || '',
      id: currentItem?.id || '',
      fileObj: currentItem?.image && `${mediaBaseURL}/media/download/${currentItem?.image}` || null,
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue('fileObj', Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    },
    [setValue]
  );

  const onSubmit = async (operator) => {
    const formData = new FormData();
    formData.append('id', `${operator.id}`);
    formData.append('title', `${operator.title}`);

    if (operator.fileObj?.name) {
      formData.append('file', operator.fileObj);
    } else if (operator.fileObj) {
      formData.append('image', currentItem.image);
    }
    let resp;
    if (isEdit) {
      resp = await updateOperatorAPI(formData);
    } else resp = await createOperatorAPI(formData);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.operators);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label={translate('sim.operator.title')} disabled={isView} />
              <div>
                <LabelStyle>{translate('sim.post.featureImage')}</LabelStyle>
                <RHFUploadSingleFile
                  disabled={isView}
                  name="fileObj"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
              </div>
              {isView ? (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.sim.root}/category/${currentItem?.id}/edit`}
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
