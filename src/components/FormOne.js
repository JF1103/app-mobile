import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
      <View>
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fb8c00',
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 20,
            borderColor: '#fb8c00',
            borderWidth: 1,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', left: 10}}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Icon style={styles.icon} name="arrow-back-outline" />
          </TouchableOpacity>

          <Text style={styles.text}>Formularios</Text>
        </View>
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
  text: {
    //justifyContent: 'center',
    //marginLeft: '-45%',
    fontSize: 25,
    color: '#FAFAFA',
    //width: windowWidth,
    marginBottom: 5,
  },
  icon: {
    fontSize: 30,
    //marginRight: 300,
    color: '#FAFAFA',
  },
});

export default FormOne;
