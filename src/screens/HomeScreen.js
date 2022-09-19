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

const HomeScreen = ({navigation}) => {
  const {userInfo, logout} = useContext(AuthContext);
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

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
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    }}>
                    <Text style={styles.texto}>Fecha: {employee?.fecha}</Text>
                  </View>

                  <Text style={styles.welcome}>
                    Sucursal: {employee?.cliente}
                  </Text>
                  <ItemSeparator />
                  <Text style={styles.sucursal}>
                    Direccion: {employee?.sucursal}
                  </Text>
                  <ItemSeparator />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Text style={styles.texto}>{employee?.actividad}</Text>
                    <ItemSeparator />
                    <Text style={styles.texto}>Nivel: {employee?.nivel}</Text>
                  </View>
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
                          style={{width: '100%'}}>
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
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
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
    borderWidth: 0.3,
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
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },

  welcome: {
    fontSize: 18,
    padding: 5,
    color: '#000000',
    textAlign: 'center',
  },
  texto: {
    fontSize: 18,
    padding: 5,
    color: '#000000',
    textAlign: 'center',
  },
  sucursal: {
    fontSize: 13,
    padding: 5,
    color: '#000000',
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '100%',
    justifyContent: 'center',
    color: '#f5f5f5',
    marginBottom: 10,
  },
});

export default HomeScreen;
