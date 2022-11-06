import React from 'react';
import WebView from 'react-native-webview';
import {Linking} from 'react-native';

export const Ruta = ({navigation, route}) => {
  const {latitud, longitud} = route.params;
  const caracter = longitud <= 0 ? '+' : '';

  const coor = latitud + ',' + caracter + longitud;

  return (
    <WebView
      source={{uri: `https://www.google.com/maps/search/${coor}`}}
      onShouldStartLoadWithRequest={event => {
        if (event.url.match(/(goo\.gl\/maps)|(maps\.app\.goo\.gl)/)) {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      }}
    />
  );
};
