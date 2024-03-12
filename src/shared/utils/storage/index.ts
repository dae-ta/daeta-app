import Keychain from 'react-native-keychain';

type KeyType = 'accessToken' | 'refreshToken' | 'expiredAt';

type GetSecureValue = (key: KeyType) => Promise<string | false>;

export const setSecureValue = (key: KeyType, value: string) =>
  Keychain.setGenericPassword(key /* <- can be a random string */, value, {
    service: key,
  });

export const getSecureValue: GetSecureValue = async key => {
  const result = await Keychain.getGenericPassword({service: key});
  if (result) {
    return result.password;
  }
  return false;
};

export const removeSecureValue = (key: KeyType) =>
  Keychain.resetGenericPassword({service: key});
