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
import {handleResp} from '../helpers/handleRespt';
import {useLocation} from '../hooks/useLocation';

export const Maps = ({
  cordsOt,
  tareaId,
  idotd,
  formularioId,
  refformularioconector,
  pregunta,
  formularioPreguntas,
  setFormularioPreguntas,
  employee,
  idUsuario,
  cords,
}) => {
  /*  const [location, setLocation] = useState();
  let nbr_latitud = 0;
  let nbr_longitud = 0; */

  /*  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setLocation({
          nbr_latitud: Number(info.coords.latitude),
          nbr_longitud: Number(info.coords.longitude),
        });
      },

      err => {
        // console.log('entre error');
        //console.log(err);
      },
      {
        enableHighAccuracy: false,
      },
    );
  }, []); */
  const {hasLocation, initialPosition} = useLocation();
  useEffect(() => {
    /* handleRespLocation(tareaId, pregunta.id, location, pregunta.tiporespuesta); */
    if (initialPosition.latitude !== 0 && initialPosition.longitude !== 0) {
      console.log('entre', initialPosition);
      handleResp(
        tareaId,
        idotd,
        formularioId,
        refformularioconector,
        pregunta.id,
        {
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
        },
        pregunta.tiporespuesta,
        formularioPreguntas,
        setFormularioPreguntas,
        employee,
        idUsuario,
        {
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
        },
      );
    }
  }, [initialPosition]);

  return (
    <View key={pregunta.id} style={{height: 300}}>
      <Text style={styles.geo}>{pregunta.pregunta}</Text>
      <Text style={styles.geoText}>
        Latitud:{initialPosition.latitude} longitud:
        {initialPosition.longitude}
      </Text>
      {hasLocation ? (
        <>
          <MapView
            showsUserLocation={true}
            style={styles.geolocalizacion}
            initialRegion={{
              latitude: initialPosition.latitude,
              longitude: initialPosition.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {/* <Marker
              coordinate={{
                latitude: nbr_latitud,
                longitude: nbr_longitud,
              }}
              title="My Marker"
              description="Some description"
            /> */}
          </MapView>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  geo: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
    marginTop: 20,
  },
  geoText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  geolocalizacion: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
});
