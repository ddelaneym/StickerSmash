
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
    return 'com.ddelaneym.stickersmash.dev';
    }

    if (IS_PREVIEW) {
    return 'com.ddelaneym.stickersmash.preview';
    }

    return 'com.ddelaneym.stickersmash';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'StickerSmash (Dev)';
    }

    if (IS_PREVIEW) {
        return 'StickerSmash (Preview)';
    }

    return 'StickerSmash: Emoji Stickers';
};

export default {
    name: getAppName(),
    slug: "StickerSmash",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#25292e"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: getUniqueIdentifier()
    },
    android: {
        adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
    },
        package: getUniqueIdentifier()
    },
    web: {
        favicon: "./assets/favicon.png"
    },
    extra: {
        eas: {
            projectId: "6ddef1cc-f4a3-45f7-bef3-99b4c4e9f062"
        }
    },
    updates: {
        url: "https://u.expo.dev/6ddef1cc-f4a3-45f7-bef3-99b4c4e9f062"
    },
    runtimeVersion: {
        policy: "appVersion"
    },
    owner: "ddelaneym"
};
