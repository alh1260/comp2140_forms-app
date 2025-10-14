import {Drawer} from "expo-router/drawer";

function RootLayout()
{
    return (
        <Drawer>
            <Drawer.Screen name="index" options={{title: "Home"}}/>
            <Drawer.Screen name="about" options={{title: "About"}}/>
        </Drawer>
    );
}

export {RootLayout as default};
