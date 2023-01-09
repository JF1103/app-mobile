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
import {Chase} from 'react-native-animated-spinkit';
import {validaCampos} from '../helpers/validaCampos';

const heightInitial = 55;
const heightDelta = 20;
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
  const {userInfo} = useContext(AuthContext);
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

  const [formsended, setformsended] = useState(false);

  useEffect(() => {
    SetStorage(formularioPreguntas);
    setformAsync(formularioPreguntas);
  }, [formularioPreguntas]);

  const preguntas = formulario.preguntas;
  const [text, setText] = useState(textAsync ? textAsync : '');
  const [IditemSelect, setIditemSelect] = useState(0);
  const [selectedItem, setSelectedItem] = useState(singleSelectInit);
  const [mountMulti, setMountMulti] = useState(false);
  const {getCurrentLocation} = useLocation();
  const [disabled, setDisabled] = useState(false);
  const [countLine, setCountLine] = useState(
    textAsync ? Math.floor(textAsync.length / 35 + 1) : 1,
  );

  const [singleSelectReq, setsingleSelectReq] = useState(false);
  const [multiSelectReq, setmultiSelectReq] = useState(false);
  const [textAreaReq, settextAreaReq] = useState(false);
  const [firmaReq, setfirmaReq] = useState(false);
  const [fileReq, setfileReq] = useState(false);
  const [mapsReq, setmapsReq] = useState(false);
  const [validaForm, setvalidaForm] = useState(false);

  useEffect(() => {
    const numeroRespuestas = formAsync?.formcomplet
      ?.filter(item => item.idUsuario === idUsuario)[0]
      ?.ots.filter(item => item.id_ot === employee.id)[0]
      ?.tareas.filter(item => item.TareaId === tarea.id)[0]
      ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
      ?.preguntas.filter(item => item.checkSend === true).length;

    const numeroPreguntas = formulario.preguntas.length;

    const ended = formAsync?.formcomplet
      ?.filter(item => item.idUsuario === idUsuario)[0]
      ?.ots.filter(item => item.id_ot === employee.id)[0]
      ?.tareas.filter(item => item.TareaId === tarea.id)[0]
      ?.formularios.filter(
        item => item.FormularioId === formulario.id,
      )[0]?.ended;

    if (numeroRespuestas === numeroPreguntas) {
      setformsended(true);
      setDisabled(true);
      setSending(false);
      if (ended !== true) {
        let copy = formularioPreguntas;
        copy.formcomplet
          .filter(item => item.idUsuario === idUsuario)[0]
          .ots.filter(item => item.id_ot === employee.id)[0]
          .tareas.filter(item => item.TareaId === tarea.id)[0]
          .formularios.filter(
            item => item.FormularioId === formulario.id,
          )[0].ended = true;

        copy.formcomplet
          .filter(item => item.idUsuario === idUsuario)[0]
          .ots.filter(item => item.id_ot === employee.id)[0]
          .tareas.filter(
            item => item.TareaId === tarea.id,
          )[0].ErrorSend = false;

        setFormularioPreguntas({...copy});
      }
    } else {
      console.log('no terminado');
      setSending(false);
    }
  }, [formAsync]);

  const [sending, setSending] = useState(false);

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
              ?.formularios.filter(
                item => item.FormularioId === formulario.id,
              )[0]
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
            <View key={index2}>
              {pregunta.tiporespuesta === 'Seleccion Simple' ? (
                <View key={pregunta.id} style={{alignItems: 'center'}}>
                  <Text style={styles.selsim}>{pregunta.pregunta}</Text>
                  <View
                    pointerEvents={disabled ? 'none' : 'auto'}
                    style={
                      singleSelectReq
                        ? {
                            borderColor: 'red',
                            borderRadius: 10,
                            width: '100%',
                            borderWidth: 2,
                          }
                        : {
                            borderColor: '#fb8c00',
                            borderWidth: 1,
                            borderRadius: 10,
                            width: '100%',
                          }
                    }>
                    <RNSingleSelect
                      key={pregunta.id}
                      searchEnabled={false}
                      data={data}
                      initialValue={selectedItem}
                      selectedItem={selectedItem}
                      buttonContainerStyle={
                        disabled ? {backgroundColor: '#E8D3BB'} : {}
                      }
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
                          }),
                          selectedItem !== undefined &&
                            setsingleSelectReq(false);
                      }}
                      placeholder="Elegir opción"
                      width="100%"
                    />
                  </View>
                </View>
              ) : pregunta.tiporespuesta === 'Seleccion Multiple' ? (
                <View style={{alignItems: 'center', marginBottom: -80}}>
                  <View
                    key={pregunta.id}
                    style={{
                      height: 170 + 50 * dataMulti.length,
                    }}>
                    <Text style={styles.selmul}>{pregunta.pregunta}</Text>
                    <View
                      pointerEvents={disabled ? 'none' : 'auto'}
                      style={{
                        height: 200,
                      }}>
                      <ScrollView
                        horizontal={true}
                        style={{
                          width: '100%',
                        }}>
                        <RNMultiSelect
                          key={pregunta.id}
                          style={multiSelectReq ? styles.smError : styles.sm}
                          disableAbsolute={true}
                          buttonContainerStyle={
                            disabled ? {backgroundColor: '#E8D3BB'} : {}
                          }
                          data={dataMulti}
                          menuItemTextStyle={{textDecorationLine: 'none'}}
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
                                    setIditemSelect(selectedItems);
                                })
                              : setMountMulti(true),
                              setIditemSelect(selectedItems),
                              selectedItems.length > 0 &&
                                setmultiSelectReq(false);
                          }}
                          placeholder="Elegir opción"
                        />
                      </ScrollView>
                    </View>
                  </View>
                </View>
              ) : pregunta.tiporespuesta === 'Texto' ? (
                <View
                  key={pregunta.id}
                  style={{alignItems: 'center'}}
                  pointerEvents={disabled ? 'none' : 'auto'}>
                  <Text style={styles.text}>{pregunta.pregunta}</Text>
                  <RNTextArea
                    defaultCharCount={text.length}
                    key={pregunta.id}
                    textInputStyle={{
                      fontSize: 15,
                      color: 'black',
                      textAlignVertical: 'top',
                    }}
                    style={
                      disabled
                        ? styles.textareaDisable
                        : textAreaReq
                        ? styles.textareaError
                        : {
                            ...styles.textarea,
                            height: heightInitial + heightDelta * countLine,
                          }
                    }
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
                        setText(text),
                        setCountLine(
                          Math.floor(
                            text.replace(/(\r\n|\n|\r)/gm, '').length / 30 + 1,
                          ) +
                            (text.split('\n').length - 1),
                        ),
                        text !== '' && settextAreaReq(false);
                    }}
                    value={text}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Geolocalizacion' ? (
                <View pointerEvents={disabled ? 'none' : 'auto'}>
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
                    mapsReq={mapsReq}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Archivo' ? (
                <View pointerEvents={disabled ? 'none' : 'auto'}>
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
                    disabled={disabled}
                    fileReq={fileReq}
                    setfileReq={setfileReq}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Firma' ? (
                <>
                  <Text style={styles.textfirma}>{pregunta.pregunta}</Text>
                  <View pointerEvents={disabled ? 'none' : 'auto'}>
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
                      firmaReq={firmaReq}
                      setfirmaReq={setfirmaReq}
                    />
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          );
        })}
        <View
          style={{alignItems: 'center'}}
          pointerEvents={disabled ? 'none' : 'auto'}>
          <TouchableOpacity
            style={disabled ? styles.btnDisable : styles.btnSubmit}
            onPress={() => {
              setSending(true);
              validaCampos(
                selectedItem,
                setsingleSelectReq,
                text,
                settextAreaReq,
                IditemSelect,
                setmultiSelectReq,
                setfirmaReq,
                setfileReq,
                setmapsReq,
                tarea.id,
                idotd,
                formulario.id,
                formulario.refformularioconector,
                formularioPreguntas,
                setFormularioPreguntas,
                formulario,
                userInfo,
                employee.id,
                employee,
                setvalidaForm,
                idUsuario,
                setSending,
              );
            }}>
            {sending ? (
              <Chase color="white" size={14} />
            ) : (
              <Text style={{...styles.text6}}>Enviar Formulario</Text>
            )}
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
    marginBottom: 50,
    marginTop: 10,
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
    fontSize: 23,
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    color: 'white',
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
    textDecorationLine: 'underline',
  },
  texterror: {},
  selsim: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  selmul: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  textarea: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    width: '100%',
  },
  textareaError: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: 'red',
    borderWidth: 2,
    width: '80%',
  },
  textareaDisable: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    backgroundColor: '#E8D3BB',
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
    textDecorationLine: 'underline',
  },
  smError: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: 'red',
    borderWidth: 2,
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
    textDecorationLine: 'underline',
  },
  btnDisable: {
    backgroundColor: '#E8D3BB',
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
    alignItems: 'center',
  },
  btnSubmit: {
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
    alignItems: 'center',
  },
});
