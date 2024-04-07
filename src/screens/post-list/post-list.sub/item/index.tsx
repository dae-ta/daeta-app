import {NavigationProp, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Post} from '../../../../shared/apis/post/list-post';
import {S3_BUCKET_URL} from '../../../../shared/constants/urls';
import {RootStackParamList} from '../../../../shared/types/native-stack';
import {commarizeNumber} from '../../../../shared/utils/number/commarize-number';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface Props {
  post: Post;
}

export const Item = ({post}: Props) => {
  console.log(post, 'post');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const createdTime = dayjs(post.createdAt).fromNow();

  const handlePress = () => {
    navigation.navigate('PostDetail', {postId: post.id});
  };

  const dates = post.DatesAtMs.map(date =>
    dayjs(Number(date.dateAtMs)).format('ddd'),
  )
    .map(date => date)
    .join(', ');

  return (
    <Pressable onPress={handlePress} style={styles.itemContainer}>
      <Text style={styles.title}>{post.title}</Text>
      <Text
        style={styles.contents}>{`하안돌곱창 • 하안동 • ${createdTime}`}</Text>
      <View style={styles.bottomContainer}>
        <View>
          <Text style={styles.bottomMainText}>
            {post.paymentType} {commarizeNumber(String(post.payment))}원
          </Text>
          <Text style={styles.bottomSubText}>
            {dates} • {post.startTime}~{post.endTime}
          </Text>
        </View>
        {post.Images[0]?.imageUrl && (
          <Image
            style={styles.image}
            src={`${S3_BUCKET_URL}/${post.Images[0]?.imageUrl}`}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D5D5D5',
  },
  title: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contents: {
    marginBottom: 10,
    fontSize: 12,
    color: '#8C8C8C',
  },

  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomMainText: {
    marginBottom: 5,
  },
  bottomSubText: {
    fontSize: 12,
    color: '#8C8C8C',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
});
