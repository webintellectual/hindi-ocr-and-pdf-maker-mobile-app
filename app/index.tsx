import CustomButton from "@/components/atoms/button";
import { setLoading } from '@/redux/slices_for_features/homeScreenLoading';
import {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from './types/navigation';

export default function Index() {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.home_screen.loading);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [language, setLanguage] = useState(TextRecognitionScript.DEVANAGARI);
  const animation = useRef<LottieView>(null);

  const takePhoto = async () => {
    // No permissions request is necessary for launching the camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]) {
      dispatch(setLoading(true)); // Set loading to true when starting the image processing
      navigation.navigate('TextEditor', { image_uri: result.assets[0].uri, language: language });
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      dispatch(setLoading(true)); // Set loading to true when starting the image processing
      navigation.navigate('TextEditor', { image_uri: result.assets[0].uri, language: language });
    }
  };

  return (
    <View style={styles.outerContainer}>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> :
      <>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 300,
            height: 300,
            // backgroundColor: 'red',
          }}
          resizeMode="cover" 
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require('../assets/animations/docScan.json')}
        />
        <Picker
          selectedValue={language}
          onValueChange={(value) => setLanguage(value)}
          style={{ width: "50%", color: "black" }}
          dropdownIconColor="black"
        >
          <Picker.Item label="Hindi (Devanagari)" value={TextRecognitionScript.DEVANAGARI} />
          <Picker.Item label="English (Latin)" value={TextRecognitionScript.LATIN} />
        </Picker>
        <CustomButton title="SCAN" onPress={takePhoto} />
        <Text>or</Text>
        <CustomButton title="UPLOAD" onPress={pickImage}/>
      </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  }
})