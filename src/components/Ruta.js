import React from 'react'
import WebView from 'react-native-webview';

export const Ruta = ({navigation, route}) => {
    const {latitud, longitud} = route.params;
    const caracter= (longitud <= 0) ? "+" : ""
        
    const coor = latitud + "," + caracter + longitud
    console.log(coor)
  return (
    <WebView source={{ uri: `https://www.google.com/maps/search/${coor}` }} />
  )
}
