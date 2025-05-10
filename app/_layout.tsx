import store from "@/redux/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
    <StatusBar style="dark"  />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="TextEditor" />
      </Stack>
    </Provider> 
  );
}
