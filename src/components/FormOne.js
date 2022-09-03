import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import RNSingleSelect, {
  ISingleSelectDataType,
} from '@freakycoder/react-native-single-select';
import RNMultiSelect, {
  IMultiSelectDataTypes,
} from '@freakycoder/react-native-multiple-select';
import RNTextArea from '@freakycoder/react-native-text-area';

import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {GetFiles} from './GetFiles';

import Firma from './Firma';

import {check, PERMISSIONS, request} from 'react-native-permissions';
import {Maps} from './Maps';
import Page from './Recaudio';
import {ItemSeparator} from './ItemSeparator';
import Geolocation from '@react-native-community/geolocation';

const FormOne = ({navigation, route}) => {
  const {tareas, latitud, longitud, employee} = route.params;
  const initialFormState = {
    id_ot: employee.id,
    fecha: employee.fecha,
    fechafin: employee.fechafin,
    preguntas: [],
  };

  const [formularioPreguntas, setFormularioPreguntas] =
    useState(initialFormState);

  const [selectedItem, setSelectedItem] = useState();
  const [respuestas, setRespuestas] = useState();

  const cordsOt = {latitud: latitud, longitud: longitud};

  const {userInfo} = useContext(AuthContext);
  const [IditemSelect, setIditemSelect] = useState(0);
  const [location, setLocation] = useState({});
  /*   const {form, onChange, setFormValue} = UseForm(); */
  console.log(JSON.stringify(formularioPreguntas));
  const handleResptext = (id, respuesta, tipo) => {
    const index = formularioPreguntas.preguntas.findIndex(
      pregunta => pregunta.id === id,
    );

    if (index === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: [
          ...formularioPreguntas.preguntas,
          {id: id, respuesta: respuesta},
        ],
      });
    } else {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: formularioPreguntas.preguntas.map(pregunta =>
          pregunta.id === id ? {...pregunta, respuesta: respuesta} : pregunta,
        ),
      });
    }
  };

  const handleRespSelect = (id, respuesta, tipo) => {
    const index = formularioPreguntas.preguntas.findIndex(
      pregunta => pregunta.id === id,
    );

    if (index === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: [
          ...formularioPreguntas.preguntas,
          {id: id, respuesta: respuesta},
        ],
      });
    } else {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: formularioPreguntas.preguntas.map(pregunta =>
          pregunta.id === id ? {...pregunta, respuesta: respuesta} : pregunta,
        ),
      });
    }
  };

  const handleRespSelectMultiple = (id, respuesta, tipo) => {
    const index = formularioPreguntas.preguntas.findIndex(
      pregunta => pregunta.id === id,
    );

    if (index === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: [
          ...formularioPreguntas.preguntas,
          {id: id, respuesta: respuesta},
        ],
      });
    } else {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: formularioPreguntas.preguntas.map(pregunta =>
          pregunta.id === id ? {...pregunta, respuesta: respuesta} : pregunta,
        ),
      });
    }
  };

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

        {tareas?.formularios?.map((tarea, index) => {
          const preguntas = tarea.preguntas;
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.welcome}>{tarea.formulario}</Text>
              <ItemSeparator />
              {preguntas?.map((pregunta, index2) => {
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
                        <View
                          style={{
                            borderColor: '#fb8c00',
                            borderWidth: 1,
                            borderRadius: 10,
                          }}>
                          <RNSingleSelect
                            key={pregunta.id}
                            searchEnabled={false}
                            data={data}
                            initialValue={selectedItem}
                            selectedItem={selectedItem}
                            onSelect={selectedItem => {
                              setSelectedItem(selectedItem),
                                handleRespSelect(
                                  pregunta.id,
                                  selectedItem.value,
                                  pregunta.tiporespuesta,
                                );
                            }}
                            placeholder="Elegir opción"
                            width="100%"
                          />
                        </View>
                        <ItemSeparator />
                      </View>
                    ) : pregunta.tiporespuesta === 'Seleccion Multiple' ? (
                      <View key={pregunta.id}>
                        <Text style={styles.selmul}>{pregunta.pregunta}</Text>
                        <RNMultiSelect
                          key={pregunta.id}
                          style={styles.sm}
                          disableAbsolute
                          data={dataMulti}
                          onSelect={selectedItems => {
                            setIditemSelect(selectedItems),
                              handleRespSelectMultiple(
                                pregunta.id,
                                selectedItems,
                                pregunta.tiporespuesta,
                              );
                          }}
                          placeholder="Elegir opción"
                        />
                        <ItemSeparator />
                      </View>
                    ) : pregunta.tiporespuesta === 'Texto' ? (
                      <View key={pregunta.id}>
                        <Text style={styles.text}>{pregunta.pregunta}</Text>
                        <RNTextArea
                          key={pregunta.id}
                          textInputStyle={{fontSize: 15, color: 'black'}}
                          style={styles.textarea}
                          maxCharLimit={200}
                          placeholderTextColor="#000000"
                          exceedCharCountColor="#990606"
                          placeholder={'Escriba aquí ...'}
                          onChangeText={text => {
                            handleResptext(
                              pregunta.id,
                              text,
                              pregunta.tiporespuesta,
                            );
                          }}
                        />
                        <ItemSeparator />
                      </View>
                    ) : pregunta.tiporespuesta === 'Geolocalizacion' ? (
                      <>
                        <Maps
                          cordsOt={cordsOt}
                          pregunta={pregunta}
                          formularioPreguntas={formularioPreguntas}
                          setFormularioPreguntas={setFormularioPreguntas}
                        />
                      </>
                    ) : pregunta.tiporespuesta === 'Archivo' ? (
                      <>
                        <GetFiles
                          pregunta={pregunta}
                          formularioPreguntas={formularioPreguntas}
                          setFormularioPreguntas={setFormularioPreguntas}
                        />
                      </>
                    ) : pregunta.tiporespuesta === 'Firma' ? (
                      <View key={pregunta.id}>
                        <Text style={styles.textfirma}>
                          {pregunta.pregunta}
                        </Text>

                        <Firma
                          preguntaid={pregunta.id}
                          formularioPreguntas={formularioPreguntas}
                          setFormularioPreguntas={setFormularioPreguntas}
                          preguntatiporespuesta={pregunta.tiporespuesta}
                        />
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.btn5}
          onPress={() => {
            handleRespLocation('gfgf', 'gfg');
            /*   navigation.navigate(''); */
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
    backgroundColor: '#ffffff',
    marginHorizontal: '6%',
    marginVertical: '1%',
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 2,
  },
  welcome: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    textAlign: 'center',
  },
  icon: {
    fontSize: 30,
    marginRight: 300,
    color: '#000000',
    marginTop: 5,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000000',
    marginTop: -35,
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
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
  },
  sm: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 40,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  text6: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },
  textfirma: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    textAlign: 'center',
  },
});

export default FormOne;
