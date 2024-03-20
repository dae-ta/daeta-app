import {createAxiosInstance} from '../axios/create-axios-instance';

export const CREATE_POST_API_PATH = '/post';

export const createPost = async (formData: {
  title: string;
  content: string;
  imagePaths: string[];
}) => {
  const {data} = await createAxiosInstance().post(
    CREATE_POST_API_PATH,
    formData,
  );

  return data;
};
