import {NavigationProp, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Post} from '../../../../shared/apis/post/list-post';
import {S3_BUCKET_URL} from '../../../../shared/constants/urls';
import {RootStackParamList} from '../../../../shared/types/native-stack';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface Props {
  post: Post;
}

export const Item = ({post}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const createdTime = dayjs(post.createdAt).fromNow();

  const handlePress = () => {
    navigation.navigate('PostDetail', {postId: post.id});
  };

  return (
    <Pressable onPress={handlePress} style={styles.itemContainer}>
      <Text style={styles.title}>{post.title}</Text>
      <Text
        style={styles.contents}>{`하안돌곱창 • 하안동 • ${createdTime}`}</Text>
      <View style={styles.bottomContainer}>
        <View>
          <Text>시급 12,000원</Text>
          <Text>월~금 • 18:00~00:00 </Text>
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
    paddingBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contents: {
    marginBottom: 20,
  },

  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
});
