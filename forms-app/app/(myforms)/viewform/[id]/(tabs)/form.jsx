import {View} from "react-native";
import {Text} from "react-native-paper";

/*
 * Idea on how to deal with record state:
 *
 * set it as an Object, I.e.
 *     const [rec, setRec] = useState({});
 * 
 * then to update the state, we use Object.defineProperty
 *     setRec(Object.defineProperty({...rec}, prop, {
 *                         value: <new value>,
 *                         writable: true,
 *                         enumerable: true,
 *                         configurable: true
 *                     }));
 */


function ViewForm()
{
    return (
        <View>
            <Text>TODO: Put the forms view here!</Text>
        </View>
    );
}

export {ViewForm as default};
