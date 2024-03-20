import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

export const Header = ({children}: {children?: ReactNode}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <SimpleLineIcon
        name="arrow-left"
        size={15}
        onPress={() => {
          navigation.goBack();
        }}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D5D5D5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
