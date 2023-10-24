import { capitalCase } from 'change-case';
// next
// @mui
import { Box, Card, Container, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_AUTH } from '../../routes/paths';
// guards
import GuestGuard from '../../guards/GuestGuard';
// components
import Image from '../../components/Image';
import Logo from '../../components/Logo';
import Page from '../../components/Page';
// sections
import { RegisterForm } from '../../sections/auth/register';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
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

// ----------------------------------------------------------------------

export default function Register() {
  const { method } = useAuth();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <GuestGuard>
      <Page title="Register">
        <RootStyle>

          {mdUp && (
            <SectionStyle>
              <Typography variant="body2" sx={{ mt: 5, mb: 5, fontSize: 20, p: 2 }}>
                Bạn đã có tài khoản?
                <Link sx={{ fontSize: 20 }} to={PATH_AUTH.login} variant="subtitle2">
                  Đăng nhập
                </Link>
              </Typography>
              <Logo />
              {/* <Typography variant="h4" sx={{ px: 5, mt: 2, mb: 2 }}>
                Hotline: 0828.59.6789
              </Typography> */}
              <Typography variant="h3" sx={{ px: 5, mt: 5, mb: 5 }}>
                Tuyển cộng tác viên !
              </Typography>
              <Typography sx={{ fontSize: 17, fontFamily: 'serif' }} >
                📱 Cơ hội kiếm tiền ngay từ việc bán sim số trên Sim68.net!<br />
                🌟 Không yêu cầu vốn đầu tư, chỉ cần lấy sim và bắt đầu kinh doanh.<br />
                💼 Tự do làm việc, linh hoạt thời gian làm việc.<br />
                🚀 Tiềm năng thu nhập không giới hạn theo năng lực và sự cố gắng của bạn.<br />
                📈 Hệ thống quản lý tiện lợi, dễ dàng theo dõi doanh số bán hàng.<br />
                💬 Hỗ trợ trực tuyến 24/7, giải đáp mọi thắc mắc của bạn.<br />
                📣 Đăng ký ngay để trở thành đối tác cùng Sim68.net và khám phá cơ hội không giới hạn!
              </Typography>
            </SectionStyle>
          )}

          <Container>
            <ContentStyle>
              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Hãy đăng kí ngay
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Để trở thành đối tác cùng SIM68.NET</Typography>
                </Box>
                <Tooltip title={capitalCase(method)}>
                  <>
                    <Image
                      disabledEffect
                      alt={method}
                      src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${method}.png`}
                      sx={{ width: 32, height: 32 }}
                    />
                  </>
                </Tooltip>
              </Box>

              <RegisterForm />

              {!smUp && (
                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                  Already have an account?{' '}
                  <Link to={PATH_AUTH.login} variant="subtitle2">
                    Login
                  </Link>
                </Typography>
              )}
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
