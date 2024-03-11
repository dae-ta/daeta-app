import React, {forwardRef} from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({label, ...textInputProps}, ref) => {
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput ref={ref} style={styles.textInput} {...textInputProps} />
      </View>
    );
  },
);

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
});
