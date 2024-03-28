import {createAxiosInstance} from '../axios/create-axios-instance';

export const GET_POST_API_PATH = (id: number) => `/post/${id}`;

export type Post = {
  id: number;
  title: string;
  content: string;
  Images: {
    id: number;
    imageUrl: string;
  }[];
  createdAt: string;
  User: {
    email: string;
    id: number;
  };
};

export const getPost = async (id: number) => {
  const {data} = await createAxiosInstance().get(GET_POST_API_PATH(id));

  return data as Post;
};
