import {Drawer} from "expo-router/drawer";
import {PaperProvider} from "react-native-paper";

function RootLayout()
{
    return (
        <PaperProvider>
            <Drawer>
                <Drawer.Screen name="index" options={{title: "Home"}}/>
                <Drawer.Screen name="about" options={{title: "About"}}/>
            </Drawer>
        </PaperProvider>
    );
}

export {RootLayout as default};
