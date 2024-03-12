import axios from 'axios';
import {API_BASE_URL} from '../../constants/urls';

const TOKEN_ACCESS_API_PATH = '/auth/token/access';

type Response = {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
};

export const postAuthTokenAccess = async (refreshToken: string) => {
  const {data} = await axios.post<Response>(
    `${API_BASE_URL}${TOKEN_ACCESS_API_PATH}`,
    {},
    {headers: {authorization: `Bearer ${refreshToken}`}},
  );

  return data;
};
