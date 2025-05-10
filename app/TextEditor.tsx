import CustomButton from '@/components/atoms/button';
import { setLoading } from '@/redux/slices_for_features/homeScreenLoading';
import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';
import { Printer } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

type RootStackParamList = {
  TextEditor: {
    language?: TextRecognitionScript;
    image_uri?: string;
  };
};

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

type TextEditorScreenRouteProp = RouteProp<RootStackParamList, 'TextEditor'>;

const TextEditor = () => {
  const route = useRoute<TextEditorScreenRouteProp>();
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.home_screen.loading);
  const { image_uri } = route.params || {};
  const language = route.params.language || TextRecognitionScript.DEVANAGARI;
  const [editedText, setEditedText] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | undefined>();
  const generateHtml = (text: string) => `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        .content {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <div class="content">${text}</div>
    </body>
  </html>
  `;

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: generateHtml(editedText),
      // printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    const { uri } = await Print.printToFileAsync({
      html: generateHtml(editedText)
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  const processImage = async (uri: string) => {
    const recognizedText = await TextRecognition.recognize(uri, language);
    setEditedText(recognizedText.text);
    dispatch(setLoading(false)); // Set loading to false when processing is done
  }

  useEffect(() => {
    if (image_uri) {
      processImage(image_uri);
    }
  }, [image_uri]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1, padding: 10, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
      {loading ? (
        <TextInput
          style={styles.editor}
          multiline
          editable={false}
          value="Loading..."
        />
      ) : (
        <TextInput
          style={styles.editor}
          scrollEnabled={false}  // disable internal scrolling
          multiline = {true}
          value={editedText}
          onChangeText={setEditedText}
          keyboardType='default'
        />
      )}
      <CustomButton title="SAVE AS PDF" onPress={printToFile} style={{width: "100%"}}/>
      <View style={styles.spacer} />
      <CustomButton title="PRINT" onPress={print} style={{width: "100%"}}/>
      {Platform.OS === 'ios' && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
};

export default TextEditor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    editor: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        minHeight: 100, 
        maxHeight: 360,  // cap height so it scrolls internally if needed
        padding: 8,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 16,
    },
    spacer: {
      height: 8,
    },
    printer: {
      textAlign: 'center',
    },
});