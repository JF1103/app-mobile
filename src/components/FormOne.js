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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SetStorage} from './SetStorage';
import {GetStorage} from './GetStorage';
import {handleResp} from '../helpers/handleRespt';
import {Formularios} from './Formularios';

const FormOne = ({navigation, route}) => {
  const {tarea, latitud, longitud, employee, idUsuario} = route.params;

  const [respuestas, setRespuestas] = useState();
  const [tex, setTex] = useState();

  const cordsOt = {latitud: latitud, longitud: longitud};

  const {userInfo} = useContext(AuthContext);

  const [location, setLocation] = useState({});

  /*   const {form, onChange, setFormValue} = UseForm(); */
  //console.log(JSON.stringify(formularioPreguntas));

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
        {/*  <Text style={styles.title}>Formulario</Text> */}
        {tarea?.formularios.map((formualario, index) => {
          return (
            <Formularios
              key={formualario.id}
              formulario={formualario}
              idotd={tarea.idotd}
              tarea={tarea}
              employee={employee}
              cordsOt={cordsOt}
              index={index}
              idUsuario={idUsuario}
            />
          );
        })}
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
