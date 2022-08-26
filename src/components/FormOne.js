import React, {useState, useContext, useEffect} from 'react';
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
import {AuthContext} from '../context/AuthContext';
import RNSingleSelect, {
  ISingleSelectDataType,
} from '@freakycoder/react-native-single-select';
import RNMultiSelect, {
  IMultiSelectDataTypes,
} from '@freakycoder/react-native-multiple-select';
import RNTextArea from '@freakycoder/react-native-text-area';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {GetFiles} from './GetFiles';
import {check, PERMISSIONS, request} from 'react-native-permissions';

const FormOne = ({navigation, route}) => {
  const [location, setLocation] = useState({});
  let nbr_latitud = 0;
  let nbr_longitud = 0;
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setLocation(info.coords);
      nbr_latitud = Number(info.coords.latitude);
      nbr_longitud = Number(info.coords.longitude);
    });
  }, []);

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
  checkLocationPermissions();
  const {tareas, latitud, longitud} = route.params;

  //console.log('tareas', tareas);
  const {userInfo} = useContext(AuthContext);
  const [respuestas, setRespuestas] = useState({});
  /*   const {form, onChange, setFormValue} = UseForm(); */
  const handleRest = (id, respuesta) => {
    const resp = Object.keys(respuestas || {});
    const hasId = resp.includes(String(id));
    const data = {[id]: respuesta};

    if (hasId) {
      setRespuestas(prev => {
        let resAux = prev;
        delete resAux[String(id)];
        return resAux;
      });
    } else {
      setRespuestas(prev => ({...prev, ...data}));
    }
  };

  const isSelect = React.useCallback(
    (id, respuesta) => {
      const resp = Object.keys(respuestas || {});
      const hasId = resp.includes(String(id));
      console.log(
        'isSelect',
        resp,
        hasId,
        id,
        respuestas[String(id)],
        respuestas[String(id)]?.respuesta,
        respuesta,
      );
      return hasId && respuestas[String(id)] == respuesta;
    },
    [respuestas],
  );

  const formData = new FormData();
  formData.append('idusuario', userInfo.idusuario);

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Icon style={styles.icon} name="arrow-back-outline" />
        </TouchableOpacity>
        <Text style={styles.title}>Formulario</Text>
        {/* {tareas?.formularios?.map((tarea, index) => {
          const preguntas = tarea.preguntas;
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.welcome}>{tarea.formulario}</Text>
              {preguntas?.map((pregunta, index) => {
                return (
                  <View key={pregunta.id}>
                    <Text>{pregunta.pregunta}</Text>
                    {pregunta?.respuestas?.map((respuesta, index) => {
                      return (
                        <Button
                          key={respuesta.id}
                          title={respuesta?.respuesta}
                          color={
                            isSelect(pregunta.id, respuesta.respuesta)
                              ? 'red'
                              : 'green'
                          }
                          onPress={() =>
                            handleRest(pregunta.id, respuesta.respuesta)
                          }
                        />
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        })} */}
        {tareas?.formularios?.map((tarea, index) => {
          const preguntas = tarea.preguntas;
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.welcome}>{tarea.formulario}</Text>
              {preguntas?.map((pregunta, index2) => {
                const IditemSelect = 0;

                const data = pregunta.respuestas.map((respuesta, index) => {
                  return {
                    id: respuesta.id,
                    value: respuesta.leyenda,
                  };
                });
                const dataMulti = pregunta.respuestas.map(
                  (respuesta, index) => {
                    return {
                      id: respuesta.id,
                      value: respuesta.leyenda,
                      isChecked: false,
                    };
                  },
                );

                return (
                  <View style={styles.container2} key={index2}>
                    {pregunta.tiporespuesta === 'Seleccion Simple' ? (
                      <View key={pregunta.id}>
                        <Text style={styles.selsim}>{pregunta.pregunta}</Text>
                        <RNSingleSelect
                          key={pregunta.id}
                          data={data}
                          selectedItem={IditemSelect}
                          onSelect={item => {
                            handleRest(pregunta.id, item.value);
                          }}
                        />
                      </View>
                    ) : pregunta.tiporespuesta === 'Seleccion Multiple' ? (
                      <View key={pregunta.id}>
                        <Text style={styles.selmul}>{pregunta.pregunta}</Text>
                        <RNMultiSelect
                          key={pregunta.id}
                          style={styles.sm}
                          disableAbsolute
                          data={dataMulti}
                          onSelect={selectedItems =>
                            console.log('SelectedItems: ', selectedItems)
                          }
                        />
                      </View>
                    ) : pregunta.tiporespuesta === 'Texto' ? (
                      <View key={pregunta.id}>
                        <Text style={styles.text}>{pregunta.pregunta}</Text>
                        <RNTextArea
                          key={pregunta.id}
                          style={styles.textarea}
                          maxCharLimit={200}
                          placeholderTextColor="#000000"
                          exceedCharCountColor="#990606"
                          placeholder={'Escribir aquí ...'}
                          onChangeText={text => {
                            pregunta.respuestas[0] = text;
                          }}
                        />
                      </View>
                    ) : pregunta.tiporespuesta === 'Geolocalizacion' ? (
                      <View key={pregunta.id} style={{height: 300}}>
                        <Text style={styles.geo}>{pregunta.pregunta}</Text>
                        <Text>
                          Latitud:{location.latitude} longitud:
                          {location.longitude}
                        </Text>
                        <MapView
                          showsUserLocation={true}
                          style={styles.geolocalizacion}
                          initialRegion={{
                            latitude: nbr_latitud,
                            longitude: nbr_longitud,
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
                      </View>
                    ) : pregunta.tiporespuesta === 'Archivo' ? (
                      <GetFiles pregunta={pregunta} />
                    ) : (
                      <></>
                    )}
                    {/* <View>
                    </View> */}
                  </View>
                );
              })}
            </View>
          );
        })}

        <Button
          title="Terminar formulario"
          onPress={() => {
            navigation.navigate('');
          }}
        />
      </View>
    </ScrollView>
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
    backgroundColor: '#fb8c00',
    marginHorizontal: '6%',
    marginVertical: '5%',
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#000000',
    borderWidth: 0.5,
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
    color: '#ff0000',
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
    fontWeight: 'bold',
  },
  textarea: {
    borderRadius: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    borderRadius: 30,

    alignItems: 'center',
    justifyContent: 'center',
  },
  geolocalizacion: {
    flex: 1,
    borderRadius: 30,
  },
});

export default FormOne;
