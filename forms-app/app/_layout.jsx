import {Drawer} from "expo-router/drawer";
import {PaperProvider, Icon} from "react-native-paper";

function RootLayout()
{
    return (
        <PaperProvider>
            <Drawer>
                <Drawer.Screen name="index" options={{
                     title: "Home",
                     drawerIcon: (opts) => (<Icon source="home" color={opts.color} size={opts.size} />)
                 }}/>
                <Drawer.Screen name="about" options={{
                     title: "About",
                     drawerIcon: (opts) => (<Icon source="information-outline" color={opts.color} size={opts.size} />)
                 }}/>
            </Drawer>
        </PaperProvider>
    );
}

export {RootLayout as default};
