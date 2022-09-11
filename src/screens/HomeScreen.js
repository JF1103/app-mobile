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

const HomeScreen = ({navigation}) => {
  const {userInfo, logout} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [cargandoAsync, setcargandoAsync] = useState(false);
  const [formAsync, setformAsync] = useState();

  const inicializaformularioPreguntas = async () => {
    const form = await GetStorage();
    if (form !== null) {
      setformAsync(form);
    }
    setcargandoAsync(false);
  };

  useEffect(() => {
    setcargandoAsync(true);
    inicializaformularioPreguntas();
  }, []);

  //console.log(JSON.stringify(formAsync));
  const checkLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      let permissionsStatus = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      console.log('permiso' + permissionsStatus);
    }
    if (Platform.OS === 'android') {
      let permissionsStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      console.log('permiso' + permissionsStatus);
    }
  };

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const formData = new FormData();
  formData.append('idusuario', userInfo.idusuario);

  const printButtonLabel = item => {
    console.log(item);
  };

  useEffect(() => {
    fetch(
      'http://forms.minnoc.com.ar/api/ordenestrabajocabecera/getallusuario.php',
      {
        method: 'POST',
        body: formData,
      },
    )
      .then(response => response.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
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
              <View style={styles.row} key={employee?.id}>
                <Text style={styles.welcome}>{employee?.fecha}</Text>
                <ItemSeparator />
                <Text style={styles.welcome}>{employee?.cliente}</Text>
                <ItemSeparator />
                <Text style={styles.welcome}>{employee?.sucursal}</Text>
                <ItemSeparator />
                <Text style={styles.welcome}>{employee?.actividad}</Text>
                <ItemSeparator />
                <Text style={styles.welcome}>{employee?.nivel}</Text>

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
                      <>
                        <Tareas
                          key={tarea.id}
                          tarea={tarea}
                          employee={employee}
                          latitud={latitud}
                          longitud={longitud}
                          formAsync={formAsync}
                          navigation={navigation}
                        />
                      </>
                    );
                  })}
                </View>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  containerb2: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 30,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },

  welcome: {
    fontSize: 18,
    marginBottom: 15,
    color: '#000000',
    textAlign: 'center',
  },
  row: {
    backgroundColor: '#ffffff',
    marginHorizontal: '6%',
    marginVertical: '5%',
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  btn1: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '50%',
    justifyContent: 'center',
    color: '#f5f5f5',
  },
});

export default HomeScreen;
