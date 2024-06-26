import {createAxiosInstance} from '../axios/create-axios-instance';

export const LIST_POST_API_PATH = '/post';

export type Post = {
  id: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  payment: number;
  paymentType: string;
  createdAt: string;

  DatesAtMs: {
    id: number;
    dateAtMs: string;
  }[];
  Images: {
    id: number;
    imageUrl: string;
  }[];
};

export const listPost = async () => {
  const {data} = await createAxiosInstance().get(LIST_POST_API_PATH);

  return data as Post[];
};
