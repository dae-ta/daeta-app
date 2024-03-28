/* eslint-disable react-native/no-inline-styles */
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useSuspenseQueries} from '@tanstack/react-query';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {GET_POST_API_PATH, getPost} from '../../shared/apis/post/get-post';
import {GET_ME_API_PATH, getMe} from '../../shared/apis/user/me';
import {Divider} from '../../shared/components/divider';
import {Header} from '../../shared/components/header';
import {S3_BUCKET_URL} from '../../shared/constants/urls';
import {
  PostDetailParam,
  RootStackParamList,
} from '../../shared/types/native-stack';

export const Post = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<PostDetailParam>>();
  const postId = route.params.postId;

  const [{data: userData}, {data: postData}] = useSuspenseQueries({
    queries: [
      {
        queryKey: [GET_ME_API_PATH],
        queryFn: () => getMe(),
      },
      {
        queryKey: [GET_POST_API_PATH],
        queryFn: () => getPost(postId),
      },
    ],
  });

  console.log(userData, 'userData');
  const isPostOwner = userData?.id === postData.User.id;

  const dimensions = Dimensions.get('window');
  const dimensionsWidth = dimensions.width;

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <Header />
        <ScrollView>
          {postData.Images?.length > 0 && (
            <SwiperFlatList
              paginationStyleItem={{
                width: 8,
                height: 8,
                top: -30,
              }}
              paginationStyle={{
                position: 'relative',
              }}
              showPagination
              data={postData.Images}
              renderItem={({item}) => {
                return (
                  <View key={item.id}>
                    <Image
                      style={{width: dimensionsWidth, height: 230}}
                      src={`${S3_BUCKET_URL}/${item.imageUrl}`}
                    />
                  </View>
                );
              }}
            />
          )}
          <View style={styles.container}>
            <Text style={styles.title}>{postData.title}</Text>
            <Divider />
            <Text>{postData.content}</Text>
          </View>
        </ScrollView>
        {!isPostOwner && (
          <Pressable
            style={[styles.contactButton, {width: dimensionsWidth - 40}]}
            onPress={() => {
              navigation.navigate('Chat', {
                userId: userData.id,
                postUserId: postData.User.id,
                postId: postData.id,
              });
            }}>
            <Text style={styles.contactButtonText}>채팅으로 연락하기</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  contactButton: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5F00FF',
    padding: 16,
    borderRadius: 15,
  },
  contactButtonText: {
    color: '#ffff',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
