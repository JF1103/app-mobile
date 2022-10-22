import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, {useContext, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {useLocation} from '../hooks/useLocation';
import {CheckinOut} from './CheckinOut';
import {getCheckInOut} from './GetStorage';
import {SendCheckinOut} from './SendCheckinOut';

const Botones = () => {
  const {logout} = useContext(AuthContext);

  const [visualizaCheck, setvisualizaCheck] = useState(true);
  const {hasLocation, initialPosition, getCurrentLocation} = useLocation();
  const {userInfo} = useContext(AuthContext);
  const navigator = useNavigation();
  getCheckInOut().then(checkinout => {
    if (checkinout !== null) {
      if (checkinout.checks[checkinout.checks.length - 1].type === 1) {
        setvisualizaCheck(false);
      } else if (checkinout.checks[checkinout.checks.length - 1].type === 2) {
        setvisualizaCheck(true);
      }
    }
  });
console.log(navigator)

  return (
    <View style={styles.containerb1}>
      <TouchableOpacity style={styles.touch2} onPress={logout}>
        <Text style={styles.text2}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={styles.touch5}
      onPress={() => {navigator.navigate("TareasFinalizadas")}}
      >
        <Text style={styles.text5}>T. Finalizadas</Text>
      </TouchableOpacity>
      {visualizaCheck ? (
        <TouchableOpacity
          style={styles.touch3}
          onPress={() => {
            CheckinOut(getCurrentLocation, userInfo, 1);
            setvisualizaCheck(false);
          }}>
          <Text style={styles.text3}>CheckIn</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.touch4}
          onPress={() => {
            CheckinOut(getCurrentLocation, userInfo, 2);
            setvisualizaCheck(true);
          }}>
          <Text style={styles.text4}>CheckOut</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerb1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fb8c00',
  },
  touch2: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '30%',
    justifyContent: 'center',
    color: '#f5f5f5',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    marginTop: 5,
  },
  text2: {
    fontSize: 15,
    color: '#fb8c00',
    textAlign: 'center',
  },
  touch3: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '30%',
    justifyContent: 'center',
    color: '#f5f5f5',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    marginTop: 5,
  },
  text3: {
    fontSize: 15,
    color: '#fb8c00',
    textAlign: 'center',
  },
  touch4: {
    flex: 1,
    backgroundColor: '#fb8c00',
    marginHorizontal: 10,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#ffffff',
    borderWidth: 1.0,
    height: 30,
    width: '30%',
    justifyContent: 'center',
    color: '#f5f5f5',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    marginTop: 5,
  },
  text4: {
    fontSize: 15,
    color: '#eeeeee',
    textAlign: 'center',
  },
  touch5: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '30%',
    color: '#f5f5f5',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    marginTop: 5,
  },
  text5: {
    fontSize: 15,
    color: '#fb8c00',
    textAlign: 'center',
  },
});

export default Botones;
