import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useSuspenseQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {LIST_POST_API_PATH, listPost} from '../../shared/apis/post/list-post';
import {RootStackParamList} from '../../shared/types/native-stack';
import {Item} from './post-list.sub/item';

export const PostList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  const {data: posts, refetch} = useSuspenseQuery({
    queryKey: [LIST_POST_API_PATH, route.params?.postId],
    queryFn: () => listPost(),
    refetchOnMount: true,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {posts.map(post => (
          <Item key={post.id} post={post} />
        ))}
      </ScrollView>
      <Pressable
        style={styles.createButton}
        onPress={() => {
          navigation.navigate('PostCreate');
        }}>
        <AntDesignIcon name="plus" size={18} color="#ffff" />
        <Text style={styles.createButtonText}>글쓰기</Text>
      </Pressable>
    </SafeAreaView>
  );
};
//   box-shadow: 0 0 4px 0 hsl(0deg 0% 82% / 50%);
const styles = StyleSheet.create({
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5F00FF',
    padding: 16,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#ffff',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
