import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { mediaBaseURL } from '../../../config';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';
import { getPostCategories, setPostCategorySearch } from '../../../redux/slices/sim/sim.postCategory';
import { getTags, setTagSearch } from '../../../redux/slices/sim/sim.tag';
import { createPostAPI, updatePostAPI } from '../../../service/sim/sim.post.service';
import { getSlug } from '../../../utils/urlSlug';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

PostNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentPost: PropTypes.object,
};

export default function PostNewForm({ isEdit, isView, currentPost }) {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { tags, search: searchTag, isLoading: isLoadingTag } = useSelector((state) => state.tag);
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getTags());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTag]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterTagByName = (value) => {
    dispatch(setTagSearch({ ...searchTag, value }));
  };

  const {
    postCategories,
    search: searchCategory,
    isLoading: isLoadingCategory,
  } = useSelector((state) => state.postCategory);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getPostCategories());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterCategoryByName = (value) => {
    dispatch(setPostCategorySearch({ ...searchCategory, value }));
  };

  const NewItemSchema = Yup.object().shape({
    title: Yup.string().required(translate('validation.required')),
    description: Yup.string().required(translate('validation.required')),
    slug: Yup.string().required(translate('validation.required')),
    metaDescription: Yup.string().required(translate('validation.required')),
    metaTitle: Yup.string().required(translate('validation.required')),
    tags: Yup.array().min(0, translate('validation.required')),
    postCategory: Yup.object().nullable().required(translate('validation.required')),
    fileObj: Yup.mixed().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      postCategory: currentPost?.postCategory || null,
      tags: currentPost?.tags || [],
      metaTitle: currentPost?.metaTitle || '',
      metaDescription: currentPost?.metaDescription || '',
      slug: currentPost?.slug || '',
      id: currentPost?.id || '',
      fileObj: currentPost?.featureImage && `${mediaBaseURL}/media/download/${currentPost?.featureImage}` || null,
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue("metaTitle", value.title, { shouldValidate: true });
        setValue("slug", getSlug(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue('fileObj', Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    },
    [setValue]
  );

  const onSubmit = async (post) => {
    const formData = new FormData();
    formData.append('id', `${post.id}`);
    formData.append('title', `${post.title}`);
    formData.append('description', `${post.description}`);
    formData.append('slug', `${post.slug}`);
    formData.append('metaDescription', `${post.metaDescription}`);
    formData.append('metaTitle', `${post.metaTitle}`);
    formData.append('postCategory.id', post.postCategory.id);

    tags.forEach((tag, index) => formData.append(`tags[${index}].id`, `${tag.id}`));
    if (post.fileObj?.name) {
      formData.append('file', post.fileObj);
    } else if (post.fileObj) {
      formData.append('featureImage', currentPost.featureImage);
    }
    let resp;
    if (isEdit) {
      resp = await updatePostAPI(formData);
    } else
      resp = await createPostAPI(formData);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.posts);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label={translate('sim.post.title')} disabled={isView} />
              <div>
                <RHFEditor name="description" readOnly={isView} sx={{ minHeight: 700 }} />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <Controller
                  name="postCategory"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete fullWidth
                      disabled={isView}
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={postCategories?.map(({ id, title }) => ({ id, title }))}
                      getOptionLabel={(option) => option.title || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingCategory}
                      onInputChange={(event, value) => {
                        handleFilterCategoryByName(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.title} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          label={translate('sim.post.category')}
                          {...params}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="tags"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      disabled={isView}
                      {...field}
                      multiple
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={tags.map(({ id, title }) => ({ id, title }))}
                      getOptionLabel={(option) => option.title}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingTag}
                      onInputChange={(event, value) => {
                        handleFilterTagByName(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.title} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField label={translate('sim.post.tags')} {...params} error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />
                <RHFTextField name="metaTitle" label={translate('sim.post.metaTitle')} disabled={isView} />
                <RHFTextField name="slug" label={translate('sim.post.slug')} disabled={isView} />
                <RHFTextField
                  name="metaDescription"
                  label={translate('sim.post.metaDescription')}
                  multiline
                  rows={4}
                  disabled={isView}
                />
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
              </Stack>
            </Card>

            {isView ? (
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.sim.root}/post/${currentPost?.id}/edit`}
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
        </Grid>
      </Grid>
    </FormProvider>
  );
}
