/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import React, {Suspense, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {RecoilRoot, useRecoilState} from 'recoil';
import {Post} from './src/screens/post';
import {PostCreate} from './src/screens/post-create';
import {PostList} from './src/screens/post-list';
import {JoinScreen} from './src/screens/join';
import {LoginScreen} from './src/screens/login';
import {SettingScreen} from './src/screens/setting';
import {getMe} from './src/shared/apis/user/me';
import {isLoggedInState} from './src/shared/recoil';
import {RootStackParamList} from './src/shared/types/native-stack';
import {getSecureValue} from './src/shared/utils/storage';
// import 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Container = () => {
  const [queryClient] = useState(() => new QueryClient({}));

  return (
    <Suspense
      fallback={
        <View>
          <Text>로딩중</Text>
        </View>
      }>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </Suspense>
  );
};

function App(): React.JSX.Element {
  const {mutateAsync: getMeMutate} = useMutation({
    mutationFn: getMe,
  });

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  useEffect(() => {
    // 앱 처음 진입시 로그인 여부 확인
    (async () => {
      const refreshToken = await getSecureValue('refreshToken');
      if (refreshToken) {
        const me = await getMeMutate();
        // me가 없다는 의미는 refresh token까지 만료되었다는 의미 -> 다시 로그인해야함
        if (me) {
          setIsLoggedIn(true);
        }
      }
      SplashScreen.hide();
    })();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="Tab">
          <Stack.Screen
            name="Tab"
            component={HomeComponent}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PostList"
            component={PostList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PostDetail"
            component={Post}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PostCreate"
            component={PostCreate}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="Join"
            component={JoinScreen}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const HomeComponent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();

  // postId가 있으면 해당 postId의 글 상세로 이동
  useEffect(() => {
    const postId = route.params?.postId;
    if (postId) {
      setTimeout(() => {
        navigation.navigate('PostDetail', {postId});
      }, 1000);
    }
  }, [route.params?.postId]);

  return (
    <Tab.Navigator initialRouteName="홈">
      <Tab.Screen
        name="홈"
        component={PostList}
        options={{
          headerShown: false,
          tabBarIcon: () => <IonIcons name="home" size={20} />,
          tabBarLabelStyle: {color: 'black'},
        }}
      />
      <Tab.Screen
        name="설정"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => <IonIcons name="settings" size={20} />,
          tabBarLabelStyle: {color: 'black'},
        }}
      />
    </Tab.Navigator>
  );
};

export default Container;
