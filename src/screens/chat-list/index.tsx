import {useSuspenseQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LIST_CHAT_API_PATH, listChat} from '../../shared/apis/chat/chat-list';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../shared/types/native-stack';

export const ChatList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const {data: chatData, refetch} = useSuspenseQuery({
    queryKey: [LIST_CHAT_API_PATH],
    queryFn: () => listChat(),
  });

  console.log(chatData, 'data');
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
        {chatData.length === 0 ? (
          <View>
            <Text>진행중인 채팅이 없습니다</Text>
          </View>
        ) : (
          <>
            {chatData.map(chat => (
              <Pressable
                key={chat.chatId}
                style={styles.itemContainer}
                onPress={() => {
                  navigation.navigate('Chat', {
                    chatId: chat.chatId,
                    postId: chat.postId,
                    userId: chat.userId,
                    postUserId: chat.postUserId,
                  });
                }}>
                <Image
                  // source={{uri: `data:${image.mime};base64,${image.data}`}}
                  source={{
                    uri: 'https://www.bizhankook.com/upload/bk/article/202108/thumb/22368-53134-sampleM.png',
                  }}
                  style={styles.image}
                />
                <View style={{flexShrink: 1}}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>김희찬</Text>
                    <Text style={styles.time}>10시간 전</Text>
                  </View>
                  <View>
                    <Text
                      style={styles.content}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      왜 답장이 없으시죠..? 혹시 시간되시면 연락주세요123456789
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
  },
  time: {
    color: '#BDBDBD',
    fontSize: 13,
  },
  content: {
    color: '#BDBDBD',
    fontSize: 14,
    flexShrink: 1,
  },
});
