import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Botones from '../components/Botones';
import {ItemSeparator} from '../components/ItemSeparator';
import {Navbar} from '../components/Navbar';
import {Ruta} from '../components/Ruta';
import {AuthContext} from '../context/AuthContext';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {GetStorage} from '../components/GetStorage';
import Tareas from '../components/Tareas';
import {GetDataOt} from '../components/GetDataOt';
import {FormContext} from '../context/FormContext';
import {CheckinOut} from '../components/CheckinOut';
import {useLocation} from '../hooks/useLocation';
import {SendArraaycheckInOut} from '../components/SendArraayCheckInOut';

const HomeScreen = ({navigation}) => {
  const {userInfo, logout} = useContext(AuthContext);
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {hasLocation, initialPosition, getCurrentLocation} = useLocation();

  useEffect(() => {
    setInterval(() => {
      CheckinOut(getCurrentLocation, userInfo, 0);
    }, 60000);
  }, []);

  /*  useEffect(() => {
    SendArraaycheckInOut();
  }, []); */

  /* const [formularioPreguntas, setFormularioPreguntas] = useState(); */

  //console.log('formAsync', formAsync);

  const [cargandoAsync, setcargandoAsync] = useState(false);
  /* const [formAsync, setformAsync] = useState(); */

  const inicializaformularioPreguntas = async () => {
    const form = await GetStorage();
    if (form !== null) {
      setformAsync(form);
      setFormularioPreguntas(form);
    }
    setcargandoAsync(false);
  };

  useEffect(() => {
    console.log('inicializo preguntas');
    setcargandoAsync(true);
    inicializaformularioPreguntas();
  }, []);

  console.log(JSON.stringify(formAsync));
  const checkLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      let permissionsStatus = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      // console.log('permiso' + permissionsStatus);
    }
    if (Platform.OS === 'android') {
      let permissionsStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      // console.log('permiso' + permissionsStatus);
    }
  };

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  /* 
  const printButtonLabel = item => {
    console.log(item);
  }; */

  useEffect(() => {
    GetDataOt(userInfo.idusuario, setData, setLoading);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Navbar />

        {isLoading && cargandoAsync && (
          <ActivityIndicator size="large" color="blue" />
        )}

        {!isLoading &&
          !cargandoAsync &&
          data?.ot?.map(employee => {
            const {latitud, longitud} = employee;
            return (
              <View style={styles.card} key={employee?.id}>
                <View style={styles.row}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Text style={styles.texto}><Text style={styles.titulo}>Fecha:</Text> {employee?.fecha}</Text>
                  
                  <Text style={styles.welcome}><Text style={styles.titulo}>Sucursal:</Text> {employee?.cliente}</Text>
                  </View>
                  <ItemSeparator />
                  <Text style={styles.sucursal}><Text style={styles.titulo}>Dirección:</Text> {employee?.sucursal}</Text>
                  <ItemSeparator />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Text style={styles.texto}><Text style={styles.titulo}>Actividad:</Text> {employee?.actividad}</Text>
                    <Text style={styles.texto}><Text style={styles.titulo}>Prioridad:</Text> {employee?.nivel}</Text>
                  </View>
                  <ItemSeparator />
                </View>

                <View style={styles.items}>
                  <View style={styles.containerb2}>
                    <TouchableOpacity
                      style={styles.btn1}
                      onPress={() => {
                        navigation.navigate('Ruta', {latitud, longitud});
                      }}>
                      <Text style={styles.text}>Iniciar Ruta</Text>
                    </TouchableOpacity>
                    {employee['0'].tareas.map(tarea => {
                      return (
                        <View
                          key={employee?.id + tarea.id}
                          style={{width: '90%'}}>
                          <Tareas
                            key={employee?.id + tarea.id}
                            tarea={tarea}
                            employee={employee}
                            latitud={latitud}
                            longitud={longitud}
                            navigation={navigation}
                            idUsuario={userInfo.idusuario}
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 5,
    shadowColor: '#836525',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  items: {
    marginTop: 15,
    flexDirection: 'row',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FBFBFB',
  },
  containerb2: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: '#eeeeee',
    textAlign: 'center',
  },

  welcome: {
    fontSize: 14,
    padding: 5,
    color: '#000000',
    textAlign: 'center',
  },
  texto: {
    fontSize: 14,
    padding: 5,
    color: '#000000',
    textAlign: 'center',
  },
  sucursal: {
    fontSize: 14,
    padding: 5,
    color: '#000000',
    textAlign: 'center',
  },
  row: {
    backgroundColor: '#ffffff',
    marginHorizontal: '2%',
    marginTop: 15,
    /*     margin: '2%',
    padding: '5%', */
    /*  borderRadius: 20, */
    /*  boxShadow: 5, */
    /*  borderColor: '#fb8c00', */
    /* borderWidth: 1, */
  },
  btn1: {
    flex: 1,
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '90%',
    justifyContent: 'center',
    color: '#f5f5f5',
    marginBottom: 10,
  },
  titulo: {
    color: '#fb8c00',
  },
});

export default HomeScreen;

