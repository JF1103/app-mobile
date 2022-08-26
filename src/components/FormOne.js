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

const FormOne = ({navigation, route}) => {
  const [location, setLocation] = useState({});
  let nbr_latitud = 0;
  let nbr_longitud = 0;
  useEffect(() => {
    Geolocation.getCurrentPosition(info => console.log(info));
  }, []);

  const {tareas, latitud, longitud} = route.params;
  nbr_latitud = Number(latitud);
  nbr_longitud = Number(longitud);

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
                          placeholder="Elegir opción"
                          width="100%"
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
                          placeholder="Elegir opción"
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
                          placeholder={'Escriba aquí ...'}
                          onChangeText={text => {
                            pregunta.respuestas[0] = text;
                          }}
                        />
                      </View>
                    ) : pregunta.tiporespuesta === 'Geolocalizacion' ? (
                      <View key={pregunta.id} style={{height: 300}}>
                        <Text style={styles.geo}>{pregunta.pregunta}</Text>
                        <Text style={styles.textarch}>
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

            <TouchableOpacity style={styles.btn5} onPress={() => {
            navigation.navigate('');
          }}>
                    <Text style={styles.text6}>Enviar formulario</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
    marginHorizontal: '6%',
    marginVertical: '5%',
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
  },
  welcome: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    textAlign: 'center',
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
    textAlign: 'center',
  },
  selsim: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    textAlign: 'center',
  },
  selmul: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    textAlign: 'center',
  },
  geo: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    textAlign: 'center',
  },
  textarea: {
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
    color: '#212121',
  },
  sm: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
  },
  geolocalizacion: {
    flex: 1,
  },
  textarch: {
    fontSize: 15,
    color: '#000000',
    padding: 5,
  },
  btn5: {
    flex: 1,
    backgroundColor: '#ffb74d',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 40,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  text6: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FormOne;
