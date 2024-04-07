import {createAxiosInstance} from '../axios/create-axios-instance';

export const CREATE_POST_API_PATH = '/post';

type FormData = {
  title: string;
  content: string;
  imagePaths: string[];
  payment: number;
  datesAtMs: number[];
  startTime: string;
  endTime: string;
  paymentType: string;
};

export const createPost = async (formData: FormData) => {
  console.log(formData, 'formData');
  const {data} = await createAxiosInstance().post(
    CREATE_POST_API_PATH,
    formData,
  );

  return data;
};
