import React, {useState, useContext, useEffect} from 'react';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {ItemSeparator} from './ItemSeparator';

export const Maps = ({cordsOt, pregunta}) => {
  const [location, setLocation] = useState({});
  let nbr_latitud = 0;
  let nbr_longitud = 0;

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setLocation({
          nbr_latitud: Number(info.coords.latitude),
          nbr_longitud: Number(info.coords.longitude),
        });
      },

      /* ,
          err => {
            console.log('entre error');
            console.log(err);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}, */
    );
  }, []);

  return (
    <View key={pregunta.id} style={{height: 300}}>
      <Text style={styles.geo}>{pregunta.pregunta}</Text>
      <Text style={styles.geoText}>
        Latitud:{location.nbr_latitud} longitud:
        {location.nbr_longitud}
      </Text>
      <ItemSeparator />
      <MapView
      style={styles.map}
        showsUserLocation={true}
        style={styles.geolocalizacion}
        initialRegion={{
          latitude: location.nbr_latitud,
          longitude: location.nbr_longitud,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          
        <Marker
          coordinate={{
            latitude: nbr_latitud,
            longitude: nbr_longitud,
          }}
          title="My Marker"
          description="Some description"
        />
      </MapView>
      <ItemSeparator />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 2,
    backgroundColor: 'red',
  },
  welcome: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 40,
    marginRight: 300,
    color: '#c88719',
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
    marginTop: -50,
  },
  container2: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  selsim: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  selmul: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  geo: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    textAlign: 'center',
  },
  geoText: {
    fontSize: 15,
    color: '#000000',
    padding: 5,
  },
  tarea: {
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
    fontWeight: 'bold',
    color: '#212121',
  },
  sm: {
    borderRadius: 30,

    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
  },
  geolocalizacion: {
    flex: 1,
  },
});
