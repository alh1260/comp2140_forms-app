import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {router} from "expo-router";
import {Drawer} from "expo-router/drawer";
import {PaperProvider, Icon} from "react-native-paper";

function MainDrawerContent(props)
{
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
             icon={(opts) => (<Icon source="home" color={opts.color} size={opts.size} />)}
             label={"Home"}
             onPress={() => {router.push("/");}} />
            <DrawerItem 
             icon={(opts) => (<Icon source="file-document-outline" color={opts.color} size={opts.size} />)}
             label={"My Forms"}
             onPress={() => {router.push("/(myforms)/myforms");}} />
            <DrawerItem 
             icon={(opts) => (<Icon source="information-outline" color={opts.color} size={opts.size} />)}
             label={"About"}
             onPress={() => {router.push("/about");}} />
        </DrawerContentScrollView>
    );
}

function RootLayout()
{
    return (
        <PaperProvider>
            <Drawer
             drawerContent={(props) => (<MainDrawerContent {...props} />)}
             screenOptions={{headerShown: false}}>
                <Drawer.Screen name="index" options={{
                     title: "Home",
                     headerShown: true
                 }}/>
                <Drawer.Screen name="about" options={{
                     title: "About",
                     headerShown: true
                 }}/>
            </Drawer>
        </PaperProvider>
    );
}

export {RootLayout as default};
