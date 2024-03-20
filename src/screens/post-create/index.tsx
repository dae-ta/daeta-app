import ImageResizer from '@bam.tech/react-native-image-resizer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {isEmpty} from 'lodash-es';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {createImage} from '../../shared/apis/common/create-image';
import {createPost} from '../../shared/apis/post/create-post';
import {Header} from '../../shared/components/header';
import {RootStackParamList} from '../../shared/types/native-stack';

type FormData = {
  title: string;
  content: string;
};

export const PostCreate = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [previewImages, setPreviewImages] = useState<ImageType[]>([]);
  const [resizedImagePaths, setResizedImagePaths] = useState<string[]>([]);
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

  const {mutate: mutateCreateImage} = useMutation({
    mutationFn: createImage,
    onError: error => {
      console.log(error);
    },
    onSuccess: data => {
      const fileNames = data.fileNames;
      setResizedImagePaths([...resizedImagePaths, ...fileNames]);
      console.log(data, 'data');
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
    },
  });
  const onSubmit = async (data: FormData) => {
    mutateCreatePost({
      title: data.title,
      content: data.content,
      imagePaths: resizedImagePaths,
    });
  };

  const handlePressImageSelect = async () => {
    const image = await ImagePicker.openPicker({
      multiple: false,
      includeBase64: true,
      includeExif: true,
      mediaType: 'photo',
    });

    setPreviewImages([...previewImages, image]);

    const response = await ImageResizer.createResizedImage(
      image.path,
      600,
      600,
      image.mime === 'image/jpeg' ? 'JPEG' : 'PNG',
      100,
      0,
    );

    const resizedImageObject = {
      uri:
        Platform.OS === 'android'
          ? response.uri
          : response.uri.replace('file://', ''),
      name: response.name,
      type: image.mime,
    };

    const formData = new FormData();
    formData.append('files', resizedImageObject);

    mutateCreateImage(formData);
  };

  const ableToLoginCondition = isEmpty(errors);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <Header />
      <View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>사진 (선택)</Text>
          <Text style={styles.subTitle}>
            일하는 공간이나 일과 관련된 사진을 올려보세요.
          </Text>
        </View>
        <View style={styles.imageSectionContainer}>
          <Pressable onPress={handlePressImageSelect}>
            <View style={styles.cameraIconContainer}>
              <IonIcons name="camera-outline" size={20} />
              <Text>{previewImages.length}/3</Text>
            </View>
          </Pressable>
          {previewImages.length > 0 && (
            <>
              {previewImages.map((image, index) => (
                <View key={index}>
                  <Image
                    style={styles.previewImage}
                    // source={{uri: `data:${image.mime};base64,${image.data}`}}
                    source={{uri: image.path}}
                  />
                </View>
              ))}
            </>
          )}
        </View>
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>제목</Text>
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
          </View>
        )}
        name="title"
      />
      {errors.title && (
        <Text style={styles.errorText}>제목을 입력해주세요</Text>
      )}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>상세내용</Text>
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
          </View>
        )}
        name="content"
      />
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.button}
          disabled={!ableToLoginCondition}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>생성하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageSectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  cameraIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: 70,
    height: 70,
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    marginLeft: 15,
  },
  subTitle: {
    color: '#747474',
  },
  textInput: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 0.3,
  },
  textAreaInput: {
    padding: 15,
    paddingTop: 20,
    borderRadius: 5,
    borderWidth: 0.3,
    height: 150,
  },
  inputWrapper: {
    padding: 20,
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
  button: {
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
