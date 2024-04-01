import dayjs, {Dayjs} from 'dayjs';
import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {ListHeader} from './calendar.helper/components/list-header';
import {getCalendarColumns} from './calendar.helper/utils/get-calendar-colmns';

interface Props {
  selectedDates: Dayjs[];
  setSelectedDates: (date: Dayjs[]) => void;
}

export const Calendar = ({selectedDates, setSelectedDates}: Props) => {
  const now = dayjs();
  const columns = getCalendarColumns(now);

  const renderItem = ({item}: {item: Dayjs}) => {
    const dateText = dayjs(item).get('date');
    const day = item.get('day');
    const color = day === 0 ? '#e67639' : '#2b2b2b';
    const isCurrentMonth = item.isSame(now, 'month');
    const isCurrentDate = item.isSame(now, 'date');
    const isSelectedDate = selectedDates.some(value => value.isSame(item));
    return (
      <Pressable
        style={[
          styles.columnContainer,
          {
            borderRadius: 25,
            backgroundColor: isSelectedDate ? '#5D5D5D' : 'transparent',
            margin: 5,
          },
        ]}
        onPress={() => {
          if (!isCurrentMonth) {
            return;
          }

          if (isSelectedDate) {
            setSelectedDates(
              selectedDates.filter(value => !value.isSame(item)),
            );
          } else {
            setSelectedDates([...selectedDates, item]);
          }
        }}>
        <Text
          style={[
            styles.text,
            {
              opacity: isCurrentMonth ? 1 : 0.4,
              fontSize: 15,
              color: isSelectedDate ? 'white' : color,
            },
          ]}>
          {isCurrentDate ? '오늘' : String(dateText)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{display: 'flex', alignItems: 'center'}}>
      <FlatList
        data={columns}
        renderItem={renderItem}
        numColumns={7}
        ListHeaderComponent={ListHeader}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
});
