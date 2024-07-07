
import { useState, useRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const placeholderImage = require('./assets/images/background-image.png');

export default function App() {
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);

    const imageRef = useRef();

    if (status === null) {
        requestPermission();
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert("You did not select an image.");
        }
    };
    
    const onReset = () => {
        setShowAppOptions(false);
    };

    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onSaveImageAsync = async () => {
        if (Platform.OS === 'web') {
            try {
                const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                    quality: 0.95,
                    width: 320,
                    height: 440,
                });

                let link = document.createElement('a');
                link.download = 'sticker-smash.jpg';
                link.href = dataUrl;
                link.click();
            } catch(e) {
                alert("There was an error");
                console.log(e);
            }
        } else {
            try {
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1,
                });

                await MediaLibrary.saveToLibraryAsync(localUri);

                if (localUri) {
                    alert("Saved!");
                }
            } catch(e) {
                alert("There was an error");
                console.log(e);
            }
        }
    };

    const onModalClose = () => {
        setIsModalVisible(false);
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer
                        placeholderImageSource={placeholderImage}
                        selectedImage={selectedImage}
                    />
                    { pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> }
                </View>
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} />
                    <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>
            <StatusBar style="light" />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25295e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
});
