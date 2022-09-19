import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ItemSeparator} from './ItemSeparator';
import {AuthContext} from '../context/AuthContext';
import RNSingleSelect, {
  ISingleSelectDataType,
} from '@freakycoder/react-native-single-select';
import RNMultiSelect from '../libs/react-native-multiple-select';
import RNTextArea from '@freakycoder/react-native-text-area';
import {GetFiles} from './GetFiles';
import {Maps} from './Maps';
import Firma from './Firma';
import {handleResp} from '../helpers/handleRespt';
import {SetStorage} from './SetStorage';
import {FormContext} from '../context/FormContext';
import {useLocation} from '../hooks/useLocation';

export const Formularios = ({
  formulario,
  idotd,
  tarea,
  employee,
  cordsOt,
  idUsuario,
}) => {
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);

  const textAsync = formAsync?.formcomplet
    ?.filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.tipo === 'Texto')[0]?.respuesta;

  const singleSelectInit = formAsync?.formcomplet
    ?.filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.tipo === 'Seleccion Simple')
    ?.map(item => {
      return {
        id: item.id,
        value: item.respuesta,
      };
    })[0];

  useEffect(() => {
    SetStorage(formularioPreguntas);
    setformAsync(formularioPreguntas);
  }, [formularioPreguntas]);
  //console.log('nuevo formularios', JSON.stringify(formularioPreguntas));

  /*   console.log('formAsync', JSON.stringify(formAsync)); */
  const preguntas = formulario.preguntas;
  const [text, setText] = useState(textAsync ? textAsync : '');
  const [IditemSelect, setIditemSelect] = useState(0);
  const [selectedItem, setSelectedItem] = useState(singleSelectInit);
  const [mountMulti, setMountMulti] = useState(false);
  const {getCurrentLocation} = useLocation();

  //console.log(selectedItem);
  //console.log('preguntas', JSON.stringify(formularioPreguntas));
  return (
    <View style={styles.row}>
      <Text style={styles.welcome}>{formulario.formulario}</Text>
      <ItemSeparator />
      {preguntas?.map((pregunta, index2) => {
        const data = pregunta.respuestas.map((respuesta, index) => {
          return {
            id: respuesta.id,
            value: respuesta.leyenda,
          };
        });

        const dataMulti = pregunta.respuestas.map((respuesta, index) => {
          const multiresp = formAsync?.formcomplet
            ?.filter(item => item.idUsuario === idUsuario)[0]
            ?.ots.filter(item => item.id_ot === employee.id)[0]
            ?.tareas.filter(item => item.TareaId === tarea.id)[0]
            ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
            ?.preguntas.filter(
              item => item.tipo === 'Seleccion Multiple',
            )[0]?.respuesta;
          const check = multiresp?.filter(item => item.id === respuesta.id)[0]
            ?.isChecked;
          return {
            id: respuesta.id,
            value: respuesta.leyenda,
            isChecked: check,
          };
        });

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
                        getCurrentLocation().then(cords => {
                          handleResp(
                            tarea.id,
                            idotd,
                            formulario.id,
                            formulario.refformularioconector,
                            pregunta.id,
                            selectedItem.value,
                            pregunta.tiporespuesta,
                            formularioPreguntas,
                            setFormularioPreguntas,
                            employee,
                            idUsuario,
                            cords,
                          );
                        });
                    }}
                    placeholder="Elegir opción"
                    width="100%"
                  />
                </View>
                <ItemSeparator />
              </View>
            ) : pregunta.tiporespuesta === 'Seleccion Multiple' ? (
              <View
                key={pregunta.id}
                style={{
                  height: 170 + 50 * dataMulti.length,
                }}>
                <Text style={styles.selmul}>{pregunta.pregunta}</Text>
                <ScrollView horizontal={true} style={{width: '100%'}}>
                  <RNMultiSelect
                    key={pregunta.id}
                    style={styles.sm}
                    disableAbsolute={true}
                    doneButtonBackgroundColor
                    data={dataMulti}
                    menuItemTextStyle={{textDecorationLine: 'none'}}
                    doneButtonTextStyle={{color: '#fb8c00'}}
                    doneButtonText="Listo"
                    menuBarContainerStyle={{
                      borderRadius: 10,
                      height: 50 * dataMulti.length,
                    }}
                    onSelect={selectedItems => {
                      mountMulti
                        ? getCurrentLocation().then(cords => {
                            handleResp(
                              tarea.id,
                              idotd,
                              formulario.id,
                              formulario.refformularioconector,
                              pregunta.id,
                              selectedItems,
                              pregunta.tiporespuesta,
                              formularioPreguntas,
                              setFormularioPreguntas,
                              employee,
                              idUsuario,
                              cords,
                            ),
                              setIditemSelect(selectedItems),
                              console.log('seleccion items', selectedItems);
                          })
                        : setMountMulti(true),
                        setIditemSelect(selectedItems);
                    }}
                    placeholder="Elegir opción"
                  />
                </ScrollView>
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
                    getCurrentLocation().then(cords => {
                      handleResp(
                        tarea.id,
                        idotd,
                        formulario.id,
                        formulario.refformularioconector,
                        pregunta.id,
                        text,
                        pregunta.tiporespuesta,
                        formularioPreguntas,
                        setFormularioPreguntas,
                        employee,
                        idUsuario,
                        cords,
                      );
                    }),
                      setText(text);
                  }}
                  value={text}
                />
                <ItemSeparator />
              </View>
            ) : pregunta.tiporespuesta === 'Geolocalizacion' ? (
              <>
                <Maps
                  cordsOt={cordsOt}
                  tareaId={tarea.id}
                  idotd={idotd}
                  formularioId={formulario.id}
                  refformularioconector={formulario.refformularioconector}
                  pregunta={pregunta}
                  formularioPreguntas={formularioPreguntas}
                  setFormularioPreguntas={setFormularioPreguntas}
                  employee={employee}
                  idUsuario={idUsuario}
                  formAsync={formAsync}
                />
              </>
            ) : pregunta.tiporespuesta === 'Archivo' ? (
              <>
                <GetFiles
                  tareaId={tarea.id}
                  idotd={idotd}
                  formularioId={formulario.id}
                  refformularioconector={formulario.refformularioconector}
                  pregunta={pregunta}
                  formularioPreguntas={formularioPreguntas}
                  setFormularioPreguntas={setFormularioPreguntas}
                  employee={employee}
                  idUsuario={idUsuario}
                  formAsync={formAsync}
                />
              </>
            ) : pregunta.tiporespuesta === 'Firma' ? (
              <View key={pregunta.id}>
                <Text style={styles.textfirma}>{pregunta.pregunta}</Text>

                {
                  <Firma
                    tareaId={tarea.id}
                    idotd={idotd}
                    formularioId={formulario.id}
                    refformularioconector={formulario.refformularioconector}
                    preguntaid={pregunta.id}
                    formularioPreguntas={formularioPreguntas}
                    setFormularioPreguntas={setFormularioPreguntas}
                    preguntatiporespuesta={pregunta.tiporespuesta}
                    employee={employee}
                    idUsuario={idUsuario}
                    formAsync={formAsync}
                  />
                }
              </View>
            ) : (
              <></>
            )}
          </View>
        );
      })}
      <TouchableOpacity
        style={{
          backgroundColor: '#fb8c00',
          borderRadius: 10,
          padding: 10,
          marginTop: 40,
        }}
        onPress={() => {
          /* SetStorage(formularioPreguntas); */
          /*   navigation.navigate(''); */
        }}>
        <Text style={styles.text6}>Terminar Formulario</Text>
      </TouchableOpacity>
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
    backgroundColor: '#ffffff',
    width: '98%',
    marginHorizontal: '6%',
    /* marginVertical: '1%', */
    marginTop: 20,
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
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
    color: 'white',
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
