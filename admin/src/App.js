// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';
import { ProgressBarStyle } from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ChartStyle } from './components/chart';
import Settings from './components/settings';
import useAuth from './hooks/useAuth';

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <NotistackProvider>
            <MotionLazyContainer>
              <ProgressBarStyle />
              <ChartStyle />
              <Settings />
              <ScrollToTop />
              {!isInitialized ? <LoadingScreen /> : <Router />}
            </MotionLazyContainer>
          </NotistackProvider>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
