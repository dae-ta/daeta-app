import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {RootStackParamList} from '../../shared/types/native-stack';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: HomeScreenProps) => {
  const handlePressButton = () => {
    navigation.navigate('Setting');
  };
  return (
    <View>
      <Text>Home</Text>
      <TouchableHighlight onPress={handlePressButton}>
        <Text>go to setting</Text>
      </TouchableHighlight>
    </View>
  );
};
