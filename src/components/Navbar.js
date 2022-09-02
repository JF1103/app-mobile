import React, {useState} from "react";
import { TouchableOpacity, Text, View, StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Botones from "./Botones";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Navbar = () => {
    const [visualizaNavbar, setvisualizaNavbar] = useState(false)
    

    return (
        <>
        <View style={{flexDirection: 'row', display: 'flex', alignItems: 'center', backgroundColor: '#fb8c00'}}>
    <TouchableOpacity onPress={() => {
        visualizaNavbar ? setvisualizaNavbar(false) : setvisualizaNavbar(true);
    }}><Icon name="reorder-three-outline" size={40} color='#000000'/>
    </TouchableOpacity>
    
    <Text style={styles.text}>Agenda de Tareas</Text>
    </View>
    {visualizaNavbar && <Botones/>}
    </>
    )  
};       


const styles = StyleSheet.create({
    text: {
        justifyContent: 'center',
        marginLeft: 40,
        fontSize: 25,
        color: '#000000',
        width: windowWidth,
    },
});