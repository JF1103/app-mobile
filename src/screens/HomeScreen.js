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

const HomeScreen = ({navigation}) => {
  const {userInfo, logout} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const form = GetStorage();
  }, []);

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

        {isLoading && <ActivityIndicator size="large" color="blue" />}

        {!isLoading &&
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

                  <TouchableOpacity
                    style={styles.btn2}
                    onPress={() => {
                      const aux = employee['0'];
                      const tareas = aux.tareas?.find(i => i);
                      navigation.navigate('FormOne', {
                        employee,
                        tareas,
                        latitud,
                        longitud,
                      });
                    }}>
                    <Text style={styles.text1}>Iniciar Tarea</Text>
                  </TouchableOpacity>
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
  text1: {
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
    borderWidth: 2,
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
  btn2: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '50%',
    justifyContent: 'center',
    marginLeft: 10,
    color: '#f5f5f5',
  },
});

export default HomeScreen;
