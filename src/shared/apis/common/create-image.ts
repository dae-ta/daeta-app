import {createAxiosInstance} from '../axios/create-axios-instance';

export const CREATE_IMAGE_API_PATH = '/common/images';

export const createImage = async (formData: FormData) => {
  const {data} = await createAxiosInstance().post(
    CREATE_IMAGE_API_PATH,
    formData,
  );

  return data;
};
