import React from 'react';
import {StyleSheet, View} from 'react-native';

export const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: '#C3C3C3',
    marginVertical: 20,
  },
});
