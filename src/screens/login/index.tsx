import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/types/native-stack';
import DismissKeyboardView from '../../shared/components/dismiss-keyboard-view';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = (text: string) => {
    setEmail(text.trim());
  };

  const onChangePassword = (text: string) => {
    setPassword(text.trim());
  };

  const onSubmit = () => {
    Alert.alert('알림', '로그인 되었습니다.');
  };

  const toSignUp = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const ableToLoginCondition = email && password;

  return (
    <DismissKeyboardView>
      <>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeEmail}
            placeholder="이메일을 입력해주세요"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.textInput}
            placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            onChangeText={onChangePassword}
            value={password}
            autoComplete="password"
            textContentType="password"
            secureTextEntry
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={passwordRef}
            onSubmitEditing={onSubmit}
          />
        </View>
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
            onPress={onSubmit}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text>회원가입하기</Text>
          </Pressable>
        </View>
      </>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
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

export default LoginScreen;
