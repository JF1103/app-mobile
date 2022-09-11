import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ItemSeparator} from './ItemSeparator';
import {AuthContext} from '../context/AuthContext';
import RNSingleSelect, {
  ISingleSelectDataType,
} from '@freakycoder/react-native-single-select';
import RNMultiSelect, {
  IMultiSelectDataTypes,
} from '@freakycoder/react-native-multiple-select';
import RNTextArea from '@freakycoder/react-native-text-area';
import {GetFiles} from './GetFiles';
import {Maps} from './Maps';
import Firma from './Firma';
import {handleResp} from '../helpers/handleRespt';
import {SetStorage} from './SetStorage';

export const Formularios = ({
  formulario,
  tarea,
  employee,
  cordsOt,
  formAsync,
  setformAsync,
}) => {
  const initialFormState = {
    id_ot: employee.id,
    fecha: employee.fecha,
    fechafin: employee.fechafin,
    tareas: [
      {
        formularios: [],
      },
    ],
  };

  //console.log('formAsync', formAsync);
  const [formularioPreguntas, setFormularioPreguntas] = useState(
    formAsync ? formAsync : initialFormState,
  );

  console.log('formularioPreguntas', JSON.stringify(formularioPreguntas));

  const textAsync = formAsync?.tareas
    ?.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.tipo === 'Texto')[0]?.respuesta;

  const singleSelectInit = formAsync?.tareas
    ?.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.tipo === 'Seleccion Simple')
    ?.map(item => {
      return {
        id: item.id,
        value: item.respuesta,
      };
    })[0];
  // console.log('singleSelectInit', JSON.stringify(singleSelectInit));

  useEffect(() => {
    SetStorage(formularioPreguntas);
    setformAsync(formularioPreguntas);
  }, [formularioPreguntas]);

  /*  console.log('formAsync', JSON.stringify(formAsync)); */
  const preguntas = formulario.preguntas;
  const [text, setText] = useState(textAsync ? textAsync : '');
  const [IditemSelect, setIditemSelect] = useState(0);
  const [selectedItem, setSelectedItem] = useState(singleSelectInit);

  console.log(selectedItem);
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
          const multiresp = formAsync?.tareas
            ?.filter(item => item.TareaId === tarea.id)[0]
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
                        handleResp(
                          tarea.id,
                          formulario.id,
                          pregunta.id,
                          selectedItem.value,
                          pregunta.tiporespuesta,
                          formularioPreguntas,
                          setFormularioPreguntas,
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
                  doneButtonBackgroundColor
                  data={dataMulti}
                  doneButtonText="Listo"
                  onSelect={selectedItems => {
                    setIditemSelect(selectedItems),
                      handleResp(
                        tarea.id,
                        formulario.id,
                        pregunta.id,
                        selectedItems,
                        pregunta.tiporespuesta,
                        formularioPreguntas,
                        setFormularioPreguntas,
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
                    handleResp(
                      tarea.id,
                      formulario.id,
                      pregunta.id,
                      text,
                      pregunta.tiporespuesta,
                      formularioPreguntas,
                      setFormularioPreguntas,
                    ),
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
                  formularioId={formulario.id}
                  pregunta={pregunta}
                  formularioPreguntas={formularioPreguntas}
                  setFormularioPreguntas={setFormularioPreguntas}
                />
              </>
            ) : pregunta.tiporespuesta === 'Archivo' ? (
              <>
                <GetFiles
                  tareaId={tarea.id}
                  formularioId={formulario.id}
                  pregunta={pregunta}
                  formularioPreguntas={formularioPreguntas}
                  setFormularioPreguntas={setFormularioPreguntas}
                  formAsync={formAsync}
                />
              </>
            ) : pregunta.tiporespuesta === 'Firma' ? (
              <View key={pregunta.id}>
                <Text style={styles.textfirma}>{pregunta.pregunta}</Text>

                {
                  <Firma
                    tareaId={tarea.id}
                    formularioId={formulario.id}
                    preguntaid={pregunta.id}
                    formularioPreguntas={formularioPreguntas}
                    setFormularioPreguntas={setFormularioPreguntas}
                    preguntatiporespuesta={pregunta.tiporespuesta}
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
    marginHorizontal: '6%',
    marginVertical: '1%',
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
