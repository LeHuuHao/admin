import { styled } from '@mui/material/styles';
// @mui
import { Box, Card, Container, Stack, Typography } from '@mui/material';
// routes
import { Link } from 'react-router-dom';
import { LoginForm } from '../../sections/auth/login';
// sections
import Page from '../../components/Page';
import useResponsive from '../../hooks/useResponsive';
import { PATH_AUTH } from '../../routes/paths';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

export default function Login() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 }, fontSize: 20 }}>
              Bạn chưa có tài khoản ?
              <Link sx={{ fontSize: 20 }} variant="subtitle2" to={PATH_AUTH.register} >
                Đăng kí ngay
              </Link>
            </Typography>
          )}
        </HeaderStyle>
        {/* 
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              abc
            </Typography>
            <Image visibleByDefault disabledEffect src="/logo/teacher.svg" alt="login" />
          </SectionStyle>
        )} */}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Chào mừng bạn đến với sim68.net!
                </Typography>
              </Box>
            </Stack>
            <LoginForm />
            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?
                <Link to={PATH_AUTH.register} variant="subtitle2">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>

  );
}
