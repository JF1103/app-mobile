import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
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
import {CargaDatosForm} from '../helpers/CargaDatosForm';

const HomeScreen = ({navigation}) => {
  const {userInfo, logout} = useContext(AuthContext);
  const {
    data,
    setData,
    formAsync,
    setformAsync,
    formularioPreguntas,
    setFormularioPreguntas,
  } = useContext(FormContext);
  const [isLoading, setLoading] = useState(true);

  const {hasLocation, initialPosition, getCurrentLocation} = useLocation();
  const [refresh, setRefresh] = useState(false);

  const pullMe = async () => {
    setRefresh(true);
    await GetDataOt(userInfo.idusuario, setData, setLoading);

    setRefresh(false);
  };

  useEffect(() => {
    setInterval(() => {
      CheckinOut(getCurrentLocation, userInfo, 0);
    }, 600000);
  }, []);

  /*  useEffect(() => {
    SendArraaycheckInOut();
  }, []); */

  /* const [formularioPreguntas, setFormularioPreguntas] = useState(); */

  const [cargandoAsync, setcargandoAsync] = useState(false);

  const inicializaformularioPreguntas = async () => {
    const form = await GetStorage();

    setformAsync(form);
    setFormularioPreguntas(form);
    //inicializa  con datos del servidor
    /*     CargaDatosForm(
      data,
      form,
      setformAsync,
      setFormularioPreguntas,
      userInfo.idusuario,
    ); */

    setcargandoAsync(false);
  };

  /*  console.log('async home', JSON.stringify(formAsync)); */
  const checkLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      let permissionsStatus = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
    }
    if (Platform.OS === 'android') {
      let permissionsStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }
  };

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  /* 
  const printButtonLabel = item => {
    
  }; */

  useEffect(() => {
    GetDataOt(userInfo.idusuario, setData, setLoading);
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setcargandoAsync(true);
      inicializaformularioPreguntas();
    }
  }, [data]);

  const [tareaEnd, setTareaEnd] = useState(false);

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            colors={['#fb8c00']}
            onRefresh={() => pullMe()}
          />
        }>
        {isLoading && cargandoAsync && (
          <ActivityIndicator size="large" color="blue" />
        )}

        {!isLoading &&
          !cargandoAsync &&
          data?.ot?.map(employee => {
            const {latitud, longitud} = employee;
            const cantTares = employee['0'].tareas.length;

            const TareasEned = employee['0'].tareas
              .map(tarea => {
                const indexUsuario = formAsync?.formcomplet?.findIndex(
                  item => item.idUsuario === userInfo.idusuario,
                );
                const indexOt = formAsync?.formcomplet[
                  indexUsuario
                ]?.ots.findIndex(item => item.id_ot === employee.id);

                const indexTarea = formAsync?.formcomplet[indexUsuario].ots[
                  indexOt
                ]?.tareas.findIndex(item => item.TareaId === tarea.id);

                const NumformEnded = formAsync?.formcomplet[indexUsuario]?.ots[
                  indexOt
                ]?.tareas[indexTarea]?.formularios.filter(
                  item => item.ended === true,
                ).length;

                const cantFormularios = tarea?.formularios.length;

                const treaEnded =
                  NumformEnded && NumformEnded === cantFormularios
                    ? true
                    : false;

                return treaEnded;
              })
              .filter(item => item === true).length;

            const otEnded = TareasEned === cantTares;

            if (otEnded) {
              return (
                <View key={employee.id}>
                  <></>
                </View>
              );
            }
            return (
              <View style={styles.card} key={employee?.id}>
                <View style={styles.row}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Text style={styles.texto}>
                      <Text style={styles.titulo}>Fecha:</Text>{' '}
                      {employee?.fecha}
                    </Text>

                    <Text style={styles.welcome}>
                      <Text style={styles.titulo}>Sucursal:</Text>{' '}
                      {employee?.cliente}
                    </Text>
                  </View>
                  <ItemSeparator />
                  <Text style={styles.sucursal}>
                    <Text style={styles.titulo}>Dirección:</Text>{' '}
                    {employee?.sucursal}
                  </Text>
                  <ItemSeparator />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Text style={styles.texto}>
                      <Text style={styles.titulo}>Actividad:</Text>{' '}
                      {employee?.actividad}
                    </Text>
                    <Text style={styles.texto}>
                      <Text style={styles.titulo}>Prioridad:</Text>{' '}
                      <Text
                        style={
                          employee?.nivel === '1-Alta'
                            ? {...styles.nivelAlto}
                            : employee?.nivel === '2-Media'
                            ? {...styles.nivelMedio}
                            : employee?.nivel === '3-Baja' && {
                                ...styles.nivelBajo,
                              }
                        }>
                        {employee?.nivel}
                      </Text>
                    </Text>
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
                      const indexUsuario = formAsync?.formcomplet?.findIndex(
                        item => item.idUsuario === userInfo.idusuario,
                      );

                      const indexOt = formAsync?.formcomplet[
                        indexUsuario
                      ]?.ots.findIndex(item => item.id_ot === employee.id);

                      const indexTarea = formAsync?.formcomplet[
                        indexUsuario
                      ].ots[indexOt]?.tareas.findIndex(
                        item => item.TareaId === tarea.id,
                      );

                      const NumformEnded = formAsync?.formcomplet[
                        indexUsuario
                      ]?.ots[indexOt]?.tareas[indexTarea]?.formularios.filter(
                        item => item.ended === true,
                      ).length;

                      //busco tareas que tengan errorSend en true
                      const ErrorSend =
                        formAsync?.formcomplet[indexUsuario]?.ots[indexOt]
                          ?.tareas[indexTarea]?.ErrorSend;

                      const cantFormularios = tarea?.formularios.length;
                      const cantTareas = employee['0'].tareas.length;

                      const treaEnded =
                        NumformEnded && NumformEnded === cantFormularios
                          ? true
                          : false;

                      if (treaEnded) {
                        return (
                          <View key={employee?.id + tarea.id}>
                            <></>
                          </View>
                        );
                      } else
                        return (
                          <View
                            key={employee?.id + tarea.id}
                            style={styles.btn2}>
                            <Tareas
                              key={employee?.id + tarea.id}
                              tarea={tarea}
                              employee={employee}
                              latitud={latitud}
                              longitud={longitud}
                              navigation={navigation}
                              idUsuario={userInfo.idusuario}
                              tareaEnd={tareaEnd}
                              setTareaEnd={setTareaEnd}
                              formEnded={NumformEnded}
                              cantFormularios={cantFormularios}
                              screenCall={'HomeScreen'}
                              ErrorSend={ErrorSend}
                            />
                          </View>
                        );
                    })}
                  </View>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    alignItems: 'center',
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
    borderColor: '#c88719',
    borderWidth: 1.0,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    color: '#f5f5f5',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  btn2: {
    flex: 1,
    borderRadius: 20,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    color: '#f5f5f5',
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  btnFinish: {
    flex: 1,
    borderRadius: 20,
    height: 30,
    width: '90%',
    justifyContent: 'center',
    color: 'red',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    color: '#fb8c00',
  },
  nivelAlto: {
    color: '#fff',
    backgroundColor: '#d50000',
    fontWeight: 'bold',
  },
  nivelMedio: {
    color: '#fff',
    backgroundColor: '#fbc02d',
    fontWeight: 'bold',
  },
  nivelBajo: {
    color: '#fff',
    backgroundColor: '#2e7d32',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
