import ImageResizer from '@bam.tech/react-native-image-resizer';
import React, {useState} from 'react';
import {View, Pressable, Text, Image, StyleSheet, Platform} from 'react-native';
import {Title} from '../../helpers/components/title';
import {useMutation} from '@tanstack/react-query';
import {createImage} from '../../../../shared/apis/common/create-image';
import {Image as ImageType} from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';
import IonIcons from 'react-native-vector-icons/Ionicons';

interface Props {
  resizedImagePaths: string[];
  setResizedImagePaths: (value: string[]) => void;
}

export const ImageSelector = ({
  resizedImagePaths,
  setResizedImagePaths,
}: Props) => {
  const [previewImages, setPreviewImages] = useState<ImageType[]>([]);

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

  const handlePressImageSelect = async () => {
    const images = await ImagePicker.openPicker({
      multiple: true,
      maxFiles: 3 - previewImages.length,
      includeBase64: true,
      includeExif: true,
      mediaType: 'photo',
    });

    setPreviewImages([...previewImages, ...images]);

    const responses = await Promise.allSettled(
      images.map(image =>
        ImageResizer.createResizedImage(
          image.path,
          600,
          600,
          image.mime === 'image/jpeg' ? 'JPEG' : 'PNG',
          100,
          0,
        ),
      ),
    );

    const formData = new FormData();

    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        const resizedImage = response.value;
        const resizedImageObject = {
          uri:
            Platform.OS === 'android'
              ? resizedImage.uri
              : resizedImage.uri.replace('file://', ''),
          name: resizedImage.name,
          type: images[index].mime,
        };

        formData.append('files', resizedImageObject);
      }
    });

    mutateCreateImage(formData);
  };

  return (
    <View>
      <Title
        title="사진 (선택)"
        subTitle="일하는 공간이나 일과 관련된 사진을 올려보세요."
      />
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
                <Image style={styles.previewImage} source={{uri: image.path}} />
              </View>
            ))}
          </>
        )}
      </View>
    </View>
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
  },
});
