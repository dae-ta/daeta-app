import {useMutation} from '@tanstack/react-query';
import React, {useRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {postJoin} from '../../shared/apis/auth/join';
import DismissKeyboardView from '../../shared/components/dismiss-keyboard-view';
import {FormInput} from '../../shared/components/form-input';
import {setSecureValue} from '../../shared/utils/storage';
import {useSetRecoilState} from 'recoil';
import {isLoggedInState} from '../../shared/recoil';
import {isEmpty} from 'lodash-es';

type FormData = {
  email: string;
  password: string;
};

export const JoinScreen = () => {
  const passwordRef = useRef<TextInput | null>(null);
  const setLoggedIn = useSetRecoilState(isLoggedInState);
  const {mutate: mutateJoin} = useMutation({
    mutationFn: postJoin,
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

  const ableToLoginCondition = isEmpty(errors);

  const onSubmit = (data: FormData) => {
    mutateJoin(data);
  };

  return (
    <DismissKeyboardView>
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
            <Text style={styles.loginButtonText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
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
