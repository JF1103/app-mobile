import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ItemSeparator} from '../components/ItemSeparator';
import {AuthContext} from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
  const {userInfo, logout} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  console.log(data);

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
        <View style={styles.containerb1}>
          <TouchableOpacity style={styles.touch2} onPress={logout}>
            <Text style={styles.text2}>Cerrar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch3}>
            <Text style={styles.text3}>CheckIn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch4}>
            <Text style={styles.text4}>CheckOut</Text>
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator size="large" color="blue" />}
        <Text style={styles.title}>Agenda de Tareas</Text>
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
                  <TouchableOpacity style={styles.btn1}>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  containerb1: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 10,
  },
  containerb2: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 30,
    alignItems: 'center',
  },
  text2: {
    flex: 1,
    fontSize: 15,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  touch2: {
    flex: 1,
    backgroundColor: '#bb002f',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#000000',
    borderWidth: 0.5,
  },
  text3: {
    lex: 1,
    fontSize: 15,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  touch3: {
    flex: 1,
    backgroundColor: '#320b86',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#000000',
    borderWidth: 0.5,
  },
  text4: {
    lex: 1,
    fontSize: 15,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  touch4: {
    flex: 1,
    backgroundColor: '#29434e',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#000000',
    borderWidth: 0.5,
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
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#000000',
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
