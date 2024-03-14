import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
// TODO: react-native-keyboard-aware-scroll-view 로 변경할것
// 인기도 더 많고 타입지원도해줌
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

interface Props {
  children: React.ReactNode;
}

const DismissKeyboardView = ({children}: Props) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
