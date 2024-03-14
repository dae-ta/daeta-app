/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {RecoilRoot, useRecoilState} from 'recoil';
import {HomeScreen} from './src/screens/home';
import {JoinScreen} from './src/screens/join';
import {LoginScreen} from './src/screens/login';
import {SettingScreen} from './src/screens/setting';
import {isLoggedInState} from './src/shared/recoil';
import {RootStackParamList} from './src/shared/types/native-stack';
import {getSecureValue, setSecureValue} from './src/shared/utils/storage';
import SplashScreen from 'react-native-splash-screen';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {postAuthTokenAccess} from './src/shared/apis/auth/token-access';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Container = () => {
  const [queryClient] = useState(() => new QueryClient({}));

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

function App(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  useEffect(() => {
    (async () => {
      const refreshToken = await getSecureValue('refreshToken');
      if (refreshToken) {
        try {
          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiredAt: newExpiredAt,
          } = await postAuthTokenAccess(refreshToken);

          await setSecureValue('accessToken', newAccessToken);
          await setSecureValue('refreshToken', newRefreshToken);
          await setSecureValue('expiredAt', newExpiredAt);

          setIsLoggedIn(true);
        } catch {
          setIsLoggedIn(false);
        }
      }
      SplashScreen.hide();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="홈"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarIcon: () => <IonIcons name="home" size={20} />,
            }}
          />
          <Tab.Screen
            name="설정"
            component={SettingScreen}
            options={{headerShown: false}}
          />
        </Tab.Navigator>
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

export default Container;
