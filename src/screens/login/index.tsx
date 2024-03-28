import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMutation} from '@tanstack/react-query';
import {isEmpty} from 'lodash-es';
import React, {useRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSetRecoilState} from 'recoil';
import {postLogin} from '../../shared/apis/auth/login';
import {FormInput} from '../../shared/components/form-input';
import {isLoggedInState} from '../../shared/recoil';
import {RootStackParamList} from '../../shared/types/native-stack';
import {setSecureValue} from '../../shared/utils/storage';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

export const LoginScreen = ({navigation}: LoginScreenProps) => {
  const passwordRef = useRef<TextInput | null>(null);
  const setLoggedIn = useSetRecoilState(isLoggedInState);

  const {mutate: mutateJoin} = useMutation({
    mutationFn: postLogin,
    onSuccess: async data => {
      const {accessToken, refreshToken, expiredAt} = data;
      await setSecureValue('accessToken', accessToken);
      await setSecureValue('refreshToken', refreshToken);
      await setSecureValue('expiredAt', expiredAt);
      setLoggedIn(true);
    },
    onError: error => {
      console.log(error);
    },
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = (data: FormData) => {
    mutateJoin(data);
  };

  const ableToLoginCondition = isEmpty(errors);

  return (
    <KeyboardAwareScrollView>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              label="이메일"
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor="#666"
              importantForAutofill="yes"
              autoComplete="email"
              textContentType="emailAddress"
              value={value}
              returnKeyType="next"
              clearButtonMode="while-editing"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.errorText}>이메일을 입력해주세요</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
              placeholderTextColor="#666"
              importantForAutofill="yes"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              autoComplete="password"
              textContentType="password"
              secureTextEntry
              returnKeyType="send"
              clearButtonMode="while-editing"
              ref={passwordRef}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.errorText}>비밀번호를 입력해주세요</Text>
        )}
        <View style={styles.buttonZone}>
          <Pressable
            style={
              ableToLoginCondition
                ? StyleSheet.compose(
                    styles.loginButton,
                    styles.loginButtonActive,
                  )
                : styles.loginButton
            }
            disabled={!ableToLoginCondition}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('Join');
            }}>
            <Text>회원가입하기</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    paddingLeft: 20,
    color: 'red',
  },
  buttonZone: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
