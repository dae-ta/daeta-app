import {RouteProp, useRoute} from '@react-navigation/native';
import {useSuspenseQuery} from '@tanstack/react-query';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {GET_POST_API_PATH, getPost} from '../../shared/apis/post/get-post';
import {Divider} from '../../shared/components/divider';
import {Header} from '../../shared/components/header';
import {S3_BUCKET_URL} from '../../shared/constants/urls';
import {RootStackParamList} from '../../shared/types/native-stack';

export const Post = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const postId = route.params!.postId!;

  const {data: post} = useSuspenseQuery({
    queryKey: [GET_POST_API_PATH],
    queryFn: () => getPost(postId),
  });

  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;

  return (
    <>
      <SafeAreaView>
        <Header />
        <ScrollView>
          {post.Images?.length > 0 && (
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
              data={post.Images}
              renderItem={({item}) => {
                console.log(item, 'item');
                return (
                  <View key={item.id}>
                    <Image
                      style={{width: imageWidth, height: 230}}
                      src={`${S3_BUCKET_URL}/${item.imageUrl}`}
                    />
                  </View>
                );
              }}
            />
          )}
          <View style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            <Divider />
            <Text>{post.content}</Text>
          </View>
        </ScrollView>
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
});
