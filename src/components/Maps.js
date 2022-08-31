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
import { ItemSeparator } from './ItemSeparator';

export const Maps = ({cordsOt, pregunta}) => {
  console.log(pregunta);
  const [location, setLocation] = useState({});
  let nbr_latitud = 0;
  let nbr_longitud = 0;
  const checkLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      let permissionsStatus = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      console.log('permiso' + permissionsStatus);
    }
    if (Platform.OS === 'android') {
      let permissionsStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      console.log('permiso' + permissionsStatus);
    }
  };

  useEffect(() => {
    checkLocationPermissions();
  }, []);

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
      <MapView
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  row: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: '6%',
    marginVertical: '5%',
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
    fontWeight: 'bold',
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
