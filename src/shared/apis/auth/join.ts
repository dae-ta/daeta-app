import {removeSecureValue} from '../../utils/storage';
import {createAxiosInstance} from '../axios/create-axios-instance';

export const JOIN_API_PATH = '/auth/join';

type JoinRequest = {
  email: string;
  password: string;
};

type JoinResponse = {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
};

export const postJoin = async ({email, password}: JoinRequest) => {
  await removeSecureValue('accessToken');
  await removeSecureValue('refreshToken');
  await removeSecureValue('expiredAt');

  const {data} = await createAxiosInstance().post<JoinResponse>(JOIN_API_PATH, {
    email,
    password,
  });

  return data;
};
