import {createAxiosInstance} from '../axios/create-axios-instance';
import {Chat} from './chat-list';

export const GET_CHAT_API_PATH = (chatId: string) => `/chat/${chatId}`;

export const getChat = async (chatId: string) => {
  const {data} = await createAxiosInstance().get(GET_CHAT_API_PATH(chatId));

  return data as Chat;
};
