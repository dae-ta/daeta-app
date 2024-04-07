import React, {useEffect} from 'react';
import {ReactNode} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

type Props = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  showCloseButton?: boolean;
  children: ReactNode;
};

export const CustomModal = ({
  modalVisible,
  setModalVisible,
  children,
  showCloseButton = true,
}: Props) => {
  const screenHeight = Dimensions.get('window').height;

  const translateY = new Animated.Value(screenHeight);

  useEffect(() => {
    if (modalVisible) {
      // 모달을 화면 위로 이동
      Animated.timing(translateY, {
        toValue: 0, // 최종 목적지를 화면 상단으로 설정
        useNativeDriver: true,
      }).start();
    } else {
      // 모달을 화면 아래로 이동
      Animated.timing(translateY, {
        toValue: screenHeight, // 최종 목적지를 화면 아래로 설정
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <Animated.View
          style={[
            styles.modalView,
            {
              transform: [{translateY}],
            },
          ]}>
          {showCloseButton && (
            <View style={styles.closeButtonContainer}>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                }}>
                <IonIcons name="close-outline" size={30} />
              </Pressable>
            </View>
          )}
          {children}
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    width: '100%',
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  closeButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
    paddingRight: 20,
  },
});
