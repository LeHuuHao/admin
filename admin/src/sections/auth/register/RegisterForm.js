import { useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  IconButton, InputAdornment,
  Stack
} from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';


// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Xin vui lòng nhập tên !'),
    email: Yup.string().email('Xin vui lòng nhập tài email').required('Xin vui lòng nhập tài email'),
    username: Yup.string().required('Xin vui lòng nhập tài khoản !'),
    password: Yup.string().required('Xin vui lòng nhập mật khẩu !'),
  });

  const defaultValues = {
    fullname: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await register(data);
    } catch (error) {
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <RHFTextField name="username" label="Tài khoản" />
        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField name="name" label="Họ tên" />
        <RHFTextField name="phone" label="Số điện thoại" />
        <RHFTextField name="email" label="Địa chỉ email" />
        <RHFTextField name="address" label="Địa chỉ" />

        {/* <RHFTextField
          label="Ngày sinh (dd/mm/yyyy)"
          variant="outlined"
          size="medium"
          type="text"
          name="birthdate"
          max="31/12/2023"
        /> */}

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Đăng kí
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
