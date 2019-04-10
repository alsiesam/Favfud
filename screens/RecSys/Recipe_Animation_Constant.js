import { Animated, Platform } from 'react-native';
import { Constants } from 'expo';

const IMAGE_HEIGHT = 300;
const HEADER_HEIGHT = (Platform.OS === 'ios') ? Constants.statusBarHeight : 0;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = 'rgba(66, 244, 146, 1)';
const HEADER_SCROLL = new Animated.Value(0);
const IMG_SCROLL = new Animated.Value(0);

export default {
    SCROLL_HEIGHT,
    THEME_COLOR,
    HEADER_SCROLL,
    IMG_SCROLL,
    textColor: HEADER_SCROLL.interpolate({
        inputRange: [0,  SCROLL_HEIGHT],
        outputRange: ["transparent", "black"],
        extrapolate: "clamp",
    }),
    headerBackground: HEADER_SCROLL.interpolate({
        inputRange: [0,  SCROLL_HEIGHT],
        outputRange: ["transparent", THEME_COLOR],
        extrapolate: "clamp",
    }),
    imgScale: IMG_SCROLL.interpolate({
        inputRange: [-25, 0],
        outputRange: [1.1, 1],
        extrapolateRight: "clamp",
    }),
    imgOpacity: IMG_SCROLL.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [0.2, 0],
    }),
    imgTextOpacity: IMG_SCROLL.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [1, 0],
    }),
}