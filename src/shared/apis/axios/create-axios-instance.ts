import axios, {AxiosRequestConfig} from 'axios';
import {API_BASE_URL} from '../../constants/urls';
import {getSecureValue, setSecureValue} from '../../utils/storage';
import {postAuthTokenAccess} from '../auth/token-access';

export const createAxiosInstance = (options?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    ...options,
  });

  axiosInstance.interceptors.request.use(async config => {
    const accessToken = await getSecureValue('accessToken');
    if (accessToken) {
      const expiredAt = await getSecureValue('expiredAt');
      const now = new Date().getTime();

      if (now >= Number(expiredAt) - 1000) {
        const refreshToken = await getSecureValue('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiredAt: newExpiredAt,
        } = await postAuthTokenAccess(refreshToken);

        await setSecureValue('accessToken', newAccessToken);
        await setSecureValue('refreshToken', newRefreshToken);
        await setSecureValue('expiredAt', newExpiredAt);

        console.log('토근재발급성공');

        config.headers.authorization = `Bearer ${newAccessToken}`;
      } else {
        config.headers.authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  });

  return axiosInstance;
};
