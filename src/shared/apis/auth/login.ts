import {removeSecureValue} from '../../utils/storage';
import {createAxiosInstance} from '../axios/create-axios-instance';

const LOGIN_API_PATH = '/auth/login';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
};

export const postLogin = async ({email, password}: LoginRequest) => {
  await removeSecureValue('accessToken');
  await removeSecureValue('refreshToken');
  await removeSecureValue('expiredAt');

  const {data} = await createAxiosInstance().post<LoginResponse>(
    LOGIN_API_PATH,
    {
      email,
      password,
    },
  );

  return data;
};
