import {createAxiosInstance} from '../axios/create-axios-instance';

export const GET_ME_API_PATH = '/user/me';

export type Me = {
  email: string;
  id: number;
};

export const getMe = async () => {
  const {data} = await createAxiosInstance().get(GET_ME_API_PATH);
  return data as Me;
};
