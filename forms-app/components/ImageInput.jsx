import {useState} from "react";
import {Image, View, useWindowDimensions} from "react-native";
import {Button} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

function ImageInput({onGetImage})
{
    const {height, width} = useWindowDimensions();
    const [imageData, setImageData] = useState({});

    const getImage = async function()
    {
        let res = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    quality: 1
                });
        
        if (!res.canceled && res.assets && res.assets.length > 0) {
            setImageData(res.assets[0]);
            onGetImage(res.assets[0].uri);
        }
    };

    return (
        <View>
            <Button
             mode="outlined"
             icon="file-image"
             onPress={getImage}>
                Select Image
            </Button>
            {(Boolean(imageData.uri)) &&
                    (<Image height={height/2} width={width/2} source={{uri: imageData.uri}} />)}
        </View>
    );
}

export default ImageInput;
