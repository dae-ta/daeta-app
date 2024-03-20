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
};
