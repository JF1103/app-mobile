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
import {ItemSeparator2} from '../components/ItemSeparator2';
import {Navbar} from '../components/Navbar';
import {Ruta} from '../components/Ruta';
import {AuthContext} from '../context/AuthContext';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {getCheckInOut, GetStorage} from '../components/GetStorage';
import Tareas from '../components/Tareas';
import {GetDataOt} from '../components/GetDataOt';
import {FormContext} from '../context/FormContext';
import {CheckinOut} from '../components/CheckinOut';
import {useLocation} from '../hooks/useLocation';
import {SendArraaycheckInOut} from '../components/SendArraayCheckInOut';
import {CargaDatosForm} from '../helpers/CargaDatosForm';
import {getCheckinoutServer} from '../helpers/getCheckinoutServer';
import {useNetInfo} from '@react-native-community/netinfo';
import {SetStorage} from '../components/SetStorage';

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
  const [visualizaCheck, setvisualizaCheck] = useState(true);
  const {isConnected} = useNetInfo();

  console.log('formAsync34444', JSON.stringify(formAsync));

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

  const sendCheckinOut = async () => {
    await SendArraaycheckInOut();
  };

  useEffect(() => {
    if (isConnected === true) {
      console.log('enviando storage');

      sendCheckinOut();
    }
  }, [isConnected]);

  const [cargandoAsync, setcargandoAsync] = useState(false);

  const inicializaformularioPreguntas = async () => {
    const form = await GetStorage();
    setformAsync(form);
    setFormularioPreguntas(form);
    //inicializa  con datos del servidor
    CargaDatosForm(
      data,
      form,
      formAsync,
      setformAsync,
      setFormularioPreguntas,
      userInfo.idusuario,
    );

    setcargandoAsync(false);
  };

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

      getCheckinoutServer(data).then(inOut => {
        if (inOut !== null) {
          if (inOut == 1) {
            setvisualizaCheck(false);
          } else if (inOut == 2) {
            setvisualizaCheck(true);
          }
        }
      });
    }
  }, [data]);

  const [tareaEnd, setTareaEnd] = useState(false);

  return (
    <View style={styles.container}>
      <Navbar
        visualizaCheck={visualizaCheck}
        setvisualizaCheck={setvisualizaCheck}
      />
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
          data?.ot &&
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
                      width: '100%',
                    }}>
                    <Text style={styles.texto}>
                      <Text style={styles.titulo}>Fecha:</Text>{' '}
                      {employee?.fecha}
                    </Text>

                    <Text style={styles.welcome}>
                      <Text style={styles.titulo}>Cliente:</Text>{' '}
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
                    style={
                      employee?.nivel === '1-Alta'
                        ? {...styles.nivelAlto}
                        : employee?.nivel === '2-Media'
                        ? {...styles.nivelMedio}
                        : employee?.nivel === '3-Baja' && {
                            ...styles.nivelBajo,
                          }
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <Text style={styles.textos}>
                        <Text
                          style={
                            employee?.nivel === '2-Media'
                              ? {...styles.titulos1}
                              : {...styles.titulos}
                          }>
                          Actividad:
                        </Text>{' '}
                        <Text
                          style={
                            employee?.nivel === '2-Media'
                              ? {...styles.titulos1}
                              : {...styles.titulos}
                          }>
                          {employee?.actividad}
                        </Text>
                      </Text>
                      <Text style={styles.textos}>
                        <Text
                          style={
                            employee?.nivel === '2-Media'
                              ? {...styles.titulos1}
                              : {...styles.titulos}
                          }>
                          Prioridad:
                        </Text>{' '}
                        <Text
                          style={
                            employee?.nivel === '2-Media'
                              ? {...styles.titulos1}
                              : {...styles.titulos}
                          }>
                          {employee?.nivel}
                        </Text>
                      </Text>
                    </View>
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
                              finish={false}
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
  textos: {
    fontSize: 14,
    padding: 5,
    color: '#f5f5f5',
  },
  textos1: {
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
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    marginTop: -5,
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
  titulos: {
    color: '#f5f5f5',
  },
  titulos1: {
    color: '#000000',
  },
  nivelAlto: {
    color: '#fff',
    backgroundColor: 'rgba(213,0,0,0.8)',
    fontWeight: 'bold',
    borderRadius: 20,
    width: '93%',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 30,
    marginTop: 5,
  },
  nivelMedio: {
    color: '#fff',
    backgroundColor: 'rgba(251, 192, 45,0.8)',
    fontWeight: 'bold',
    borderRadius: 20,
    width: '93%',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 30,
    marginTop: 5,
  },
  nivelBajo: {
    color: '#fff',
    backgroundColor: 'rgba(46, 125, 50,0.9)',
    fontWeight: 'bold',
    borderRadius: 20,
    width: '93%',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 30,
    marginTop: 5,
  },
});

export default HomeScreen;
