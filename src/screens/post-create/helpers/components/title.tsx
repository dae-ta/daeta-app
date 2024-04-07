import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
  subTitle?: string;
}

export const Title = ({title, subTitle}: Props) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: '#747474',
    marginTop: 5,
  },
});
