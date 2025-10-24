import {useState} from "react";
import {View} from "react-native";
import {Button, HelperText} from "react-native-paper";
import * as Location from "expo-location";

function LocationInput({currentLocation, onLocationFetch})
{
    const [loc, setLoc] = useState(currentLocation);

    const fetchLocation = async function()
    {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            return;
        }
        let fetchedLoc = await Location.getCurrentPositionAsync({});
	setLoc(fetchedLoc.coords);
	onLocationFetch({latitude: fetchedLoc.coords.latitude, longitude: fetchedLoc.coords.longitude});
    };

    return (
        <View>
            <Button
             mode="outlined"
             icon="map-marker-outline"
             onPress={() => fetchLocation()}>
                Location
            </Button>
            <HelperText
             type="info"
             visible={Boolean(loc)}>
                {`Lat: ${loc?.latitude}, Lon: ${loc?.longitude}`}
            </HelperText>
        </View>
    );
}

export default LocationInput;
