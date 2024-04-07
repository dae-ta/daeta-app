import {Picker} from '@react-native-picker/picker';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {Dayjs} from 'dayjs';
import {isEmpty} from 'lodash-es';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {createPost} from '../../shared/apis/post/create-post';
import {SpaceHeight} from '../../shared/components/SpaceHeight';
import {DividerHorizontal} from '../../shared/components/divider-horizontal';
import {Header} from '../../shared/components/header';
import {CustomModal} from '../../shared/components/modal';
import {RootStackParamList} from '../../shared/types/native-stack';
import {
  commarizeNumber,
  decommarizeNumString,
} from '../../shared/utils/number/commarize-number';
import {Title} from './helpers/components/title';
import {PAYMENT_TYPE, TIMES} from './helpers/constants';
import {Calendar} from './post-create.sub/calendar';
import {ImageSelector} from './post-create.sub/image-selector';

type FormData = {
  title: string;
  content: string;
  payment: number;
};

export const PostCreate = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 이미지
  const [resizedImagePaths, setResizedImagePaths] = useState<string[]>([]);

  // 일하는 날짜
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);

  // 일 시작 시간
  const [selectedStartTime, setSelectedStartTime] = useState(TIMES[0]);
  const [startModalVisible, setStartModalVisible] = useState(false);

  // 일 종료 시간
  const [selectedEndTime, setSelectedEndTime] = useState(TIMES[1]);
  const [endModalVisible, setEndModalVisible] = useState(false);

  // 임금 타입
  const [selectedPaymentType, setSelectedPaymentType] = useState('시급');
  const [paymentTypeModalVisible, setPaymentTypeModalVisible] = useState(false);

  const {mutate: mutateCreatePost} = useMutation({
    mutationFn: createPost,
    onError: error => {
      console.log(error);
    },
    onSuccess: data => {
      console.log(data, 'mutateCreatePost');
      navigation.navigate('Tab', {postId: data});
    },
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      payment: 0,
      businessName: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    mutateCreatePost({
      title: data.title,
      content: data.content,
      payment: data.payment,
      imagePaths: resizedImagePaths,
      datesAtMs: selectedDates.map(date => date.valueOf()),
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      paymentType: selectedPaymentType,
    });
  };

  const ableToLoginCondition = isEmpty(errors);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <Header />
      <ScrollView>
        <KeyboardAwareScrollView>
          <View style={{paddingHorizontal: 20}}>
            <ImageSelector
              resizedImagePaths={resizedImagePaths}
              setResizedImagePaths={setResizedImagePaths}
            />
            <SpaceHeight height={30} />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <>
                  <Title title="제목" />
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="제목을 입력해주세요"
                    placeholderTextColor="#666"
                    importantForAutofill="yes"
                    value={value}
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    blurOnSubmit={false}
                    style={styles.textInput}
                  />
                </>
              )}
              name="title"
            />
            {errors.title && (
              <Text style={styles.errorText}>제목을 입력해주세요</Text>
            )}
            <SpaceHeight height={30} />
            <Title title="일하는 날짜" />
            <Calendar
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
            <SpaceHeight height={30} />
            <Title title="일하는 시간" />
            <View style={timeStyles.container}>
              <View style={timeStyles.ItemContainer}>
                <View style={timeStyles.labelContainer}>
                  <Text style={timeStyles.label}>시작</Text>
                </View>
                <Pressable
                  style={timeStyles.selectBox}
                  onPress={() => {
                    setStartModalVisible(true);
                  }}>
                  <Text>{selectedStartTime}</Text>
                  <IonIcons name="chevron-down" size={20} />
                </Pressable>
              </View>
              <View>
                <Text>~</Text>
              </View>
              <View style={timeStyles.ItemContainer}>
                <View style={timeStyles.labelContainer}>
                  <Text style={timeStyles.label}>종료</Text>
                </View>
                <Pressable
                  style={timeStyles.selectBox}
                  onPress={() => {
                    setEndModalVisible(true);
                  }}>
                  <Text>{selectedEndTime}</Text>
                  <IonIcons name="chevron-down" size={20} />
                </Pressable>
              </View>
            </View>
            <SpaceHeight height={30} />
            <Title title="임금" />
            <View style={timeStyles.container}>
              <View style={timeStyles.ItemContainer}>
                <Pressable
                  style={timeStyles.selectBox}
                  onPress={() => {
                    setPaymentTypeModalVisible(true);
                  }}>
                  <Text>{selectedPaymentType}</Text>
                  <IonIcons name="chevron-down" size={20} />
                </Pressable>
              </View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <>
                    <View style={timeStyles.ItemContainer}>
                      <View style={timeStyles.selectBox}>
                        <TextInput
                          keyboardType="numeric"
                          style={{flexGrow: 1}}
                          onChangeText={text => {
                            console.log(text);
                            onChange(Number(decommarizeNumString(text)));
                          }}
                          onBlur={onBlur}
                          value={commarizeNumber(value)}
                        />
                        <View>
                          <Text>원</Text>
                        </View>
                      </View>
                    </View>
                  </>
                )}
                name="payment"
              />
            </View>
            <SpaceHeight height={30} />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <>
                  <Title title="상세내용" />
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="예) 업무 예시, 근무 여건, 갖추어야 할 능력, 우대사항 등"
                    placeholderTextColor="#666"
                    value={value}
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    style={styles.textAreaInput}
                  />
                </>
              )}
              name="content"
            />
          </View>
          <DividerHorizontal />
          <View style={{paddingHorizontal: 20}}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <>
                  <Title title="상호" />
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="예) 명륜진사갈비"
                    placeholderTextColor="#666"
                    importantForAutofill="yes"
                    value={value}
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    blurOnSubmit={false}
                    style={styles.textInput}
                  />
                </>
              )}
              name="businessName"
            />
            <SpaceHeight height={30} />
            <Title title="근무지 주소" />
            <View style={[styles.textInput, styles.textSearchInput]}>
              <Text>123</Text>
              <IonIcons name="search" size={20} />
            </View>
          </View>
          <View style={{height: 100}} />
        </KeyboardAwareScrollView>
      </ScrollView>
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.buttonContainer}
          disabled={!ableToLoginCondition}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>생성하기</Text>
        </Pressable>
      </View>
      {/* 모달뷰 */}
      <CustomModal
        modalVisible={startModalVisible}
        setModalVisible={setStartModalVisible}>
        <Picker
          selectedValue={selectedStartTime}
          onValueChange={itemValue => setSelectedStartTime(itemValue)}>
          {TIMES.map(time => (
            <Picker.Item key={time} label={time} value={time} />
          ))}
        </Picker>
      </CustomModal>
      <CustomModal
        modalVisible={endModalVisible}
        setModalVisible={setEndModalVisible}>
        <Picker
          selectedValue={selectedEndTime}
          onValueChange={itemValue => setSelectedEndTime(itemValue)}>
          {TIMES.map(time => (
            <Picker.Item key={time} label={time} value={time} />
          ))}
        </Picker>
      </CustomModal>
      <CustomModal
        modalVisible={paymentTypeModalVisible}
        setModalVisible={setPaymentTypeModalVisible}>
        <Picker
          selectedValue={selectedPaymentType}
          onValueChange={itemValue => setSelectedPaymentType(itemValue)}>
          {PAYMENT_TYPE.map(time => (
            <Picker.Item key={time} label={time} value={time} />
          ))}
        </Picker>
      </CustomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: '#747474',
  },
  textInput: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 0.3,
  },
  textSearchInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textAreaInput: {
    padding: 15,
    paddingTop: 20,
    borderRadius: 5,
    borderWidth: 0.3,
    height: 150,
  },
  inputWrapper: {
    paddingLeft: 20,
    paddingTop: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  errorText: {
    paddingLeft: 20,
    color: 'red',
  },
  buttonZone: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: '#5F00FF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const timeStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  ItemContainer: {
    flexGrow: 1,
    flex: 1,
  },
  labelContainer: {
    marginBottom: 5,
  },
  label: {
    color: '#5D5D5D',
    fontSize: 12,
  },
  selectBox: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    borderColor: '#5D5D5D',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
