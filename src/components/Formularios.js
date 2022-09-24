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
import SendFormulrio from './SendFormulrio';

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
        id: item.respuesta.id,
        value: item.respuesta.value,
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
    <>
    <View style={styles.row}>
      <Text style={styles.welcome}>{formulario.formulario}</Text>
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
              <View key={pregunta.id} style={{alignItems: 'center'}}>
                <Text style={styles.selsim}>{pregunta.pregunta}</Text>
                <View
                  style={{
                    borderColor: '#fb8c00',
                    borderWidth: 1,
                    borderRadius: 10,
                    width: '80%',
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
                            {id: selectedItem.id, value: selectedItem.value},
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
              </View>
            ) : pregunta.tiporespuesta === 'Seleccion Multiple' ? (
              <View style={{alignItems: 'center', marginBottom: -30}}>
              <View
                key={pregunta.id}
                style={{
                  height: 170 + 50 * dataMulti.length,
                }}>
                <Text style={styles.selmul}>{pregunta.pregunta}</Text>
                <ScrollView
                  horizontal={true}
                  style={{width: '100%'}}>
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
              </View>
              </View>
            ) : pregunta.tiporespuesta === 'Texto' ? (
              <View key={pregunta.id}  style={{alignItems: 'center'}}>
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
      <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          backgroundColor: '#fb8c00',
          borderRadius: 20,
          padding: 10,
          marginTop: 20,
          marginBottom: 20,
          width: '80%',
          shadowColor: '#000000',
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 7,
          borderColor: '#c88719',
          borderWidth: 1,
        }}
        onPress={() => {
          SendFormulrio(
            tarea.id,
            idotd,
            formulario.id,
            formulario.refformularioconector,
            formularioPreguntas,
            setFormularioPreguntas,
            employee,
            idUsuario,
          );
        }}>
        <Text style={styles.text6}>Terminar Formulario</Text>
      </TouchableOpacity>
      </View>
    </View>
    </>
  );
};
const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 20,
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
    elevation: 10,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  welcome: {
    fontSize: 18,
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    color: '#000000',
    padding: 10,
    textAlign: 'center',
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    borderColor: '#c88719',
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
  },
  selsim: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
  },
  selmul: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
  },
  textarea: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    width: '80%',
  },
  sm: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 20,
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
    fontSize: 14,
    color: '#fb8c00',
    marginVertical: '1%',
    textAlign: 'center',
  },
});
