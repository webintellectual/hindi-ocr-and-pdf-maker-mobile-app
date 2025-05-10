import { TextRecognitionScript } from "@react-native-ml-kit/text-recognition";

export type RootStackParamList = {
    Home: undefined;
    TextEditor: {
        language: TextRecognitionScript;
        image_uri?: string;
    };
};


export default function getScreenName(route: any): string {
    const routeName = route?.name;
    if (routeName) {
        return routeName;
    }
    const parentRoute = route?.parent;
    if (parentRoute) {
        return getScreenName(parentRoute);
    }
    return 'Unknown';
}