import dayjs from 'dayjs';
import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import {Column} from './column';
import IonIcons from 'react-native-vector-icons/Ionicons';

export const ListHeader = () => {
  const now = dayjs();
  const currentDateText = now.format('YYYY년 MM월');

  return (
    <View>
      <View style={styles.container}>
        <Pressable>
          <IonIcons name="chevron-back-outline" size={20} />
        </Pressable>
        <Text style={styles.title}>{currentDateText}</Text>
        <Pressable>
          <IonIcons name="chevron-forward-outline" size={20} />
        </Pressable>
      </View>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => {
          return (
            <Column
              key={index}
              text={day}
              color="gray"
              opacity={1}
              fontSize={13}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
