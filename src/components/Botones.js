import Geolocation from "@react-native-community/geolocation";
import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { AuthContext } from '../context/AuthContext';

const Botones = () => {
        const { logout } = useContext(AuthContext);
        const [visualizaCheck, setvisualizaCheck] = useState(true);
        const [location, setLocation] = useState({});
        const CheckInOut = (type) => {
                Geolocation.getCurrentPosition(
                        info => {
                                setLocation({
                                        nbr_latitud: Number(info.coords.latitude),
                                        nbr_longitud: Number(info.coords.longitude),
                                });
                        },
                );
                setvisualizaCheck(!visualizaCheck);
};
                return (

                        <View style={styles.containerb1}>
                                <TouchableOpacity style={styles.touch2} onPress={logout}>
                                        <Text style={styles.text2}>Cerrar Sesión</Text>
                                </TouchableOpacity>
                                {
                                        visualizaCheck ? (
                                                <TouchableOpacity style={styles.touch3} onPress={() => {CheckInOut ("IN")}}>
                                        <Text style={styles.text3}>CheckIn</Text>
                                </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity style={styles.touch4} onPress={() => {CheckInOut ("OUT")}}>
                                                <Text style={styles.text4}>CheckOut</Text>
                                        </TouchableOpacity>
                                        )
                                }
                        </View>
                )
        
};

        const styles = StyleSheet.create({
                containerb1: {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        backgroundColor: '#ffffff',
                        borderRadius: 20,
                        margin: 10,
                },
                touch2: {
                        flex: 1,
                        backgroundColor: '#ffffff',
                        borderRadius: 10,
                        boxShadow: 5,
                        borderColor: '#fb8c00',
                        borderWidth: 1.0,
                        height: 30,
                        width: '50%',
                        justifyContent: 'center',
                        color: '#f5f5f5',
                        marginBottom: 10,
                },
                text2: {
                        fontSize: 15,
                        color: '#fb8c00',
                        textAlign: 'center',
                },
                touch3: {
                        flex: 1,
                        backgroundColor: '#fb8c00',
                        borderRadius: 10,
                        boxShadow: 5,
                        borderColor: '#fb8c00',
                        borderWidth: 1.0,
                        height: 30,
                        width: '50%',
                        justifyContent: 'center',
                        color: '#f5f5f5',
                        marginBottom: 10,
                },
                text3: {
                        fontSize: 15,
                        color: '#eeeeee',
                        textAlign: 'center',
                        fontWeight: 'bold',
                },
                touch4: {
                        flex: 1,
                        backgroundColor: '#fb8c00',
                        borderRadius: 10,
                        boxShadow: 5,
                        borderColor: '#fb8c00',
                        borderWidth: 1.0,
                        height: 30,
                        width: '50%',
                        justifyContent: 'center',
                        color: '#f5f5f5',
                        marginBottom: 10,
                },
                text4: {
                        fontSize: 15,
                        color: '#eeeeee',
                        textAlign: 'center',
                        fontWeight: 'bold',
                },
        });


        export default Botones;