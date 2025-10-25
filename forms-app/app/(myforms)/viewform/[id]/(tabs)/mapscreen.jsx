import {useCallback, useState} from "react";
import {useFocusEffect, useGlobalSearchParams} from "expo-router";
import {ActivityIndicator, View} from "react-native";
import MapView, {Callout, Marker} from "react-native-maps";
import {Text} from "react-native-paper";
import RecordListItemCard from "../../../../../components/RecordListItemCard";
import {apiRequest} from "../../../../../api/crud.js";

function MapScreen()
{
    const {id} = useGlobalSearchParams();
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fields, setFields] = useState([]);
    const [err, setErr] = useState(false);

    const getRecords = async function()
    {
        try {
            const res = await apiRequest(`/record?form_id=eq.${id}`).then(r => r.json());
            setRecs(res);
        }
        catch (error) {
            console.log("Error fetching record data from 'viewform/[id]/mapscreen.jsx': ");
            console.log(error);
            setErr(true);
        }
        finally {
            setLoading(false);
        }
    };

    const getFields = async function()
    {
        try {
            const res = await apiRequest(`/field?form_id=eq.${id}`).then(r => r.json());
            const resArr = Array.from(res).sort((a, b) => a.order_index - b.order_index);
            setFields(resArr);
        }
        catch (error) {
            console.log("Error fetching fields from 'viewform/[id]/mapscreen.jsx': ");
            console.log(error);
            setErr(true);
        }
        finally {
            setLoading(false);
        }
    };

    const RecordMarker = function({record, fieldData})
    {
	// assuming that the record has one and exactly one location field
	const locField = (fields.filter(f => f.field_type === "location"))[0];
	const coords = {
                    latitude: record.values[locField.name].latitude,
                    longitude: record.values[locField.name].longitude
                };
        return (
            <Marker coordinate={coords}>
                <Callout tooltip>
                    <RecordListItemCard
                     record={record}
                     fieldData={fieldData} />
                </Callout>
            </Marker>
        );
    };

    const hasLocationField = () => fields.filter(f => f.field_type === "location").length > 0;

    const fallbackInitialRegion = { // Coordinates of my house!
                latitude: -27.5086072,
                longitude: 153.0576323,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            };

    useFocusEffect(useCallback(
            () => {
                getFields();
                getRecords();
                return () => {setLoading(true);};
            }, []));

    return (
        <>
            {loading ?
                    <ActivityIndicator /> :
                    (
                        <>
                            {hasLocationField() ?
                                    (<View>
                                         <MapView
                                          style={{width: "100%", height: "100%"}}
                                          initialRegion = {fallbackInitialRegion}>
                                             {recs.map(rec => (
                                                 <RecordMarker key={rec.id} record={rec} fieldData={fields} />
                                             ))}
                                         </MapView>
                                     </View>) :
                                    <Text>No Location Data Available!</Text>}
                        </>
                    )}
        </>
    );
}

export {MapScreen as default};
