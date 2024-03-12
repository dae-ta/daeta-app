import {createAxiosInstance} from '../axios/create-axios-instance';

export const ME_API_PATH = '/user/me';

export const getMe = async () => {
  try {
    const {data} = await createAxiosInstance().get(ME_API_PATH);
    return data;

    // 토큰이 없어 실패하더라도 null로 내립니다.
  } catch (error) {
    return null;
  }
};
