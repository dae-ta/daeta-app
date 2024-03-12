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
import React, {useState} from 'react';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {HomeScreen} from './src/screens/home';
import {JoinScreen} from './src/screens/join';
import {LoginScreen} from './src/screens/login';
import {SettingScreen} from './src/screens/setting';
import {isLoggedInState} from './src/shared/recoil';
import {RootStackParamList} from './src/shared/types/native-stack';

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
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Setting"
            component={SettingScreen}
            options={{title: '내 정보'}}
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
