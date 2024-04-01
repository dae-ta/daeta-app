import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Column = ({
  text,
  color,
  opacity,
  fontSize,
}: {
  text: string;
  color: string;
  opacity: number;
  fontSize: number;
}) => {
  return (
    <View style={styles.columnContainer}>
      <Text
        style={[
          styles.text,
          {color: color, opacity: opacity, fontSize: fontSize},
        ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
});
