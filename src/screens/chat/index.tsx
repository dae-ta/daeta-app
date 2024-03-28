import {RouteProp, useRoute} from '@react-navigation/native';
import {useMutation, useSuspenseQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Bubble, GiftedChat, IMessage, Send} from 'react-native-gifted-chat';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {getChat} from '../../shared/apis/chat/get-chat';
import {GET_ME_API_PATH, getMe} from '../../shared/apis/user/me';
import {Header} from '../../shared/components/header';
import {useSocket} from '../../shared/hooks/use-socket';
import {ChatParam} from '../../shared/types/native-stack';

// chatId: chat.chatId,
// postId: chat.postId,
// userId: chat.userId,
// postUserId: chat.postUserId,
export const Chat = () => {
  const route = useRoute<RouteProp<ChatParam>>();
  const {chatId: chatIdFromParams, postId, userId, postUserId} = route.params;
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [chatId, setChatId] = useState<string | undefined>(chatIdFromParams);
  const insets = useSafeAreaInsets();

  const {data: userData} = useSuspenseQuery({
    queryKey: [GET_ME_API_PATH],
    queryFn: () => getMe(),
  });

  const {mutate: mutateChat} = useMutation({
    mutationFn: getChat,
    onSuccess: data => {
      setMessages(
        data.message.map(chat => ({
          _id: Number(chat.createdAt),
          text: chat.content,
          createdAt: Number(chat.createdAt),
          user: {
            _id: chat.senderId,
            name: String(chat.senderId),
          },
        })),
      );
    },
  });

  useEffect(() => {
    socket.connect();

    if (!chatId) {
      // 채팅방이 없을 때 채팅방 생성
      socket.emit('create_chat', {
        userId: userId,
        postUserId: postUserId,
        postId: postId,
      });
    } else {
      // 채팅방이 있을 때 채팅방 입장
      socket.emit('enter_chat', {
        userId: userId,
        postUserId: postUserId,
        postId: postId,
        chatId: chatId,
      });

      mutateChat(chatId);
    }

    socket.on(
      'receive_message',
      (data: {senderId: number; content: string; createdAt: string}) => {
        console.log(data, 'receive_message');
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [
            {
              _id: Number(data.createdAt),
              text: data.content,
              createdAt: Number(data.createdAt),
              user: {
                _id: data.senderId,
                name: String(data.senderId),
              },
            },
          ]),
        );
      },
    );

    socket.on('receive_chat_id', (chatIdFromSocket: string) => {
      console.log(chatIdFromSocket, 'receive_chat_id');
      setChatId(chatIdFromSocket);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#5F00FF',
          },
          left: {
            backgroundColor: '#f2f2f2',
          },
        }}
      />
    );
  };

  return (
    <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: '#ffff'}}>
      <Header />
      {/* {chatList?.map(chat => {
        const isMe = chat.senderId === userData.id;
        return (
          <View key={chat.createdAt} style={chatStyles(isMe).chatContainer}>
            <Text style={chatStyles(isMe).chat}>{chat.content}</Text>
          </View>
        );
      })} */}
      <GiftedChat
        messages={messages}
        alignTop
        renderBubble={renderBubble}
        user={{
          _id: userData.id,
        }}
        alwaysShowSend
        renderInputToolbar={props => {
          return (
            <View style={{paddingHorizontal: 10}}>
              <View style={styles.inputContainer}>
                <AntDesignIcon name="plus" size={20} />
                <TextInput
                  {...props}
                  style={styles.input}
                  onFocus={() => {
                    setKeyboardVisible(true);
                  }}
                  onBlur={() => {
                    setKeyboardVisible(false);
                  }}
                  onChangeText={text => setMessage(text)}
                  value={message}
                />
                <IonIcons
                  name="send"
                  size={20}
                  style={styles.icon}
                  onPress={() => {
                    socket.emit('send_message', {
                      chatId: chatId,
                      senderId: userData.id,
                      message: message,
                    });
                    setMessage('');
                  }}
                />
              </View>
            </View>
          );
        }}
        renderSend={props => {
          return (
            <Send
              {...props}
              disabled={!props.text}
              containerStyle={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 4,
              }}>
              <IonIcons name="send" size={20} style={styles.icon} />
            </Send>
          );
        }}
      />
      <View style={{height: isKeyboardVisible ? 0 : insets.bottom}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffff',
  },
  input: {
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {},
});

const chatStyles = (isMe: boolean) =>
  StyleSheet.create({
    chatContainer: {
      maxWidth: '80%',
      padding: 10,
      backgroundColor: isMe ? '#5F00FF' : '#f2f2f2',
      borderRadius: 15,
      marginBottom: 10,
    },
    chat: {
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      color: isMe ? '#ffff' : '#000',
      padding: 3,
    },
  });
