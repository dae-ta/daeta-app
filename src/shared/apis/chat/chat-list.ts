import {createAxiosInstance} from '../axios/create-axios-instance';

export const LIST_CHAT_API_PATH = '/chat';

export type Chat = {
  chatId: string;
  postId: number;
  userId: number;
  postUserId: number;
  message: {
    senderId: number;
    content: string;
    createdAt: string;
  }[];
};

export const listChat = async () => {
  const {data} = await createAxiosInstance().get(LIST_CHAT_API_PATH);

  return data as Chat[];
};
