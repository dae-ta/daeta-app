import {useMutation} from '@tanstack/react-query';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {getMe} from '../../shared/apis/user/me';
import {SafeAreaView} from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const {mutate: getMeMutate} = useMutation({
    mutationFn: getMe,
    onSuccess: data => {
      console.log('getMeMutate', data);
    },
    onError: error => {
      console.log('error', error);
    },
  });
  return (
    <SafeAreaView>
      <View>
        <Text>Home</Text>
        <Pressable
          onPress={() => {
            getMeMutate();
          }}>
          <Text>Hello</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
