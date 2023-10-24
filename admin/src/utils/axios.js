import axios from 'axios';
import NProgress from 'nprogress';
import { mediaBaseURL } from '../config';
import { refreshTokenAPI } from '../service/sim/auth.service';
import { isValidToken, setSession } from './jwt';
// ----------------------------------------------------------------------

export const axiosSim = axios.create({
  baseURL: mediaBaseURL,
  timeout: 0,
});

const addBearerToken = async (config) => {
  const accessToken = window.localStorage.getItem('accessToken');
  if (accessToken && isValidToken(accessToken))
    config.headers = {
      ...config.headers, 'Authorization': `Bearer ${accessToken}`
    };
  NProgress.start();
  return config;
};

const handleResponse = async response => {
  NProgress.done();
  return (response);
};

// Request interceptor for API calls
axiosSim.interceptors.request.use(addBearerToken);
axiosSim.interceptors.response.use(handleResponse,
  async (error) => {
    NProgress.done();

    const originalRequest = error.config;
    if (error.response && (error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      // refresh token
      await refreshToken();
      return axiosSim(originalRequest);
    }
    if (error.response && (error.response.status === 401)) {
      setSession(null);
      window.location.href = "/auth/login";
    }

    throw (error);
  });


export const refreshToken = async () => {
  const refreshToken = window.localStorage.getItem('refreshToken');
  const urlencoded = new URLSearchParams();
  urlencoded.append("token", refreshToken);

  const { code, data, message } = await refreshTokenAPI(urlencoded);

  if (code === '200') {
    setSession(data?.accessToken, data?.refreshToken);
  } else
    throw message;
};

export const handleRequest = async (config) => {
  try {
    const resp = await axiosSim(config);
    return resp.data;
  } catch (error) {
    console.log(error);
    if (error.response) {
      const { code, message } = error.response.data;

      if (code === '409')
        return { code, message: "Bị trùng dữ liệu." };

      return { code, message };
    }

    return ({ code: "408", message: error.message });
  }
};