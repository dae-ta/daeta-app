import React from 'react';
import {StyleSheet, View} from 'react-native';

export const DividerHorizontal = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 10,
    backgroundColor: '#EAEAEA',
    marginVertical: 20,
  },
});
