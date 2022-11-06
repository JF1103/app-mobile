import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function Tareas({
  navigation,
  tarea,
  employee,
  latitud,
  longitud,
  index,
  idUsuario,
  tareaEnd,
  setTareaEnd,
  formEnded,
  cantFormularios,
}) {
  const flag = formEnded && formEnded === cantFormularios ? true : false;

  return (
    <TouchableOpacity
      key={employee?.id + tarea.id}
      style={styles.btn2}
      onPress={() => {
        navigation.navigate('FormOne', {
          tarea,
          employee,
          latitud,
          longitud,
          idUsuario,
        });
      }}>
      <Text style={styles.text1}>Iniciar Tarea {tarea.tarea}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn2: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '100%',
    justifyContent: 'center',

    color: '#f5f5f5',
    marginBottom: 10,
  },
  btnFinish: {
    backgroundColor: '#FFF8EF',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '100%',
    justifyContent: 'center',

    color: '#f5f5f5',
    marginBottom: 10,
    opacity: 0.5,
  },
  text1: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },
});
