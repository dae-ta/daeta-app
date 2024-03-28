export type RootStackParamList = {
  // 로그인 전 화면
  Login: undefined;
  Join: undefined;
  // 로그인 후 화면
  Tab: {
    postId?: number;
  };
  PostList: {
    postId?: number;
  };
  PostDetail: {postId: number};
  PostCreate: undefined;
  Chat: {
    chatId?: string;
    userId: number;
    postUserId: number;
    postId: number;
  };
  ChatList: undefined;
};

export type PostDetailParam = {
  PostDetail: {
    postId: number;
  };
};

export type PostListParam = {
  PostList: {
    postId?: number;
  };
};

export type ChatParam = {
  Chat: {
    chatId?: string;
    postId: number;
    userId: number;
    postUserId: number;
  };
};
