import {Text, View} from "react-native";

function About()
{
    return (
        <View
         style={{
             flex: 1,
             justifyContent: "center",
             alignItems: "center"
         }}>
            <Text>About</Text>
            <Text>An example forms app</Text>
        </View>
    );
}

export {About as default};
