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
import dayjs from 'dayjs';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {SpaceHeight} from '../../shared/components/SpaceHeight';
import {convertToMoneyFormat} from '../../shared/utils/number/convert-to-money-format';

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

  console.log(postData, 'postData');

  const createdTime = dayjs(postData.createdAt).fromNow();
  const dates = postData.DatesAtMs.map(date =>
    dayjs(Number(date.dateAtMs)).format('ddd'),
  )
    .map(date => date)
    .join(', ');

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
            <Text style={styles.subTitle}>{`하안돌곱창 • ${createdTime}`}</Text>
            <Divider />
            <View style={conditionStyles.container}>
              <IonIcons name="cash-outline" size={20} />
              <Text style={conditionStyles.text}>
                {postData.paymentType}{' '}
                {convertToMoneyFormat({
                  money: postData.payment,
                  omitUnit: 0,
                })}
              </Text>
            </View>
            <SpaceHeight height={10} />
            <View style={conditionStyles.container}>
              <IonIcons name="calendar-number-outline" size={20} />
              <Text style={conditionStyles.text}>{dates}</Text>
            </View>
            <SpaceHeight height={10} />
            <View style={conditionStyles.container}>
              <IonIcons name="time-outline" size={20} />
              <Text style={conditionStyles.text}>
                {postData.startTime} ~ {postData.endTime}
              </Text>
            </View>
            <SpaceHeight height={30} />
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
  subTitle: {
    marginTop: 10,
    fontSize: 12,
    color: '#8C8C8C',
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

const conditionStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
  },
});
