import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useRef, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {
    isLoading,
    login,
    loginError,
    setUserInfo,
    setIsLoading,
    setloginError,
  } = useContext(AuthContext);
  const scroll = useRef(null);
  

  const [requeridoEmail, setRequeridoEmail] = useState(false);
  const [requeridoPassword, setRequeridoPassword] = useState(false);

  const inciarSesion = async (email, password) => {
    console.log('INCIA', email, password);
    if (
      (email === null && password === null) ||
      (email === '' && password === '')
    ) {
      setRequeridoEmail(true);
      setRequeridoPassword(true);
      ToastAndroid.show('Todos los campos son requeridos', ToastAndroid.SHORT);
    } else if (email === null || email === '') {
      setRequeridoEmail(true);
      setRequeridoPassword(false);
      ToastAndroid.show('El campo Email es requerido', ToastAndroid.SHORT);
    } else if (password === null || password === '') {
      setRequeridoPassword(true);
      setRequeridoEmail(false);
      ToastAndroid.show('El campo Contraseña es requerido', ToastAndroid.SHORT);
    } else {
      setRequeridoEmail(false);
      setRequeridoPassword(false);
      const loginapp = login(email, password);
      loginapp
        .then(res => {
          let userInfo = res.data;

          if (userInfo.error == false) {
            userInfo.access_token = 'jjjj';
          }
          console.log(res.data.error);
          if (res.data.error === true) {
            console.log('entre', res.data.error);
            setloginError(true);

            ToastAndroid.show(
              'Usuario o contraseña incorrecta',
              ToastAndroid.SHORT,
            );
          }
          //console.log(res);
          setUserInfo(userInfo);
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

          // console.log(res.data.error);
          setIsLoading(false);
        })
        .catch(e => {
          console.log(`login error ${e}`);
          setloginError(true);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <ScrollView style={styles.scroll} ref={scroll}>
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <View style={styles.logoContainer}>
            <Image
              style={styles.img}
              source={require('./../assets/img/expo-bg1.png')}
            />
            {/*   <Image
            style={styles.img}
            resizeMode="cover"
            source={require('./../assets/img/expo-bg1.png')}
          /> */}
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.subtitle}>Email</Text>
            <View
              style={
                requeridoEmail
                  ? {...styles.containerRequerido}
                  : {...styles.input}
              }>
              <TextInput
                keyboardType="email-address"
                autoCompleteType="email"
                style={styles.inputText}
                autoCorrect={false}
                autoFocus={true}
                value={email}
                onChangeText={text => {
                  setEmail(text), scroll.current.scrollToEnd();
                }}
                onTouchStart={() => scroll.current.scrollToEnd()}
              />
            </View>
            <Text style={styles.subtitle}>Contraseña</Text>
            <View
              style={
                requeridoPassword
                  ? {...styles.containerRequerido}
                  : {...styles.input}
              }>
              <TextInput
                value={password}
                style={styles.inputText}
                onChangeText={text => setPassword(text)}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => {
                inciarSesion(email, password);
              }}>
              <Text style={styles.text}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 15,
    height: windowHeight * 0.96,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  img: {
    width: windowWidth * 0.7,
    height: windowHeight * 0.3,
    marginTop: -100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 30,
    resizeMode: 'contain',
  },
  wrapper: {
    width: '80%',
    backgroundColor: '#ffffff',
  },
  subtitle: {
    color: '#000000',
    marginLeft: 10,
    padding: 2,
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  touch: {
    backgroundColor: '#fb8c00',
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    borderColor: '#fb8c00',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  scroll: {
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    adjustContent: 'center',
    width: 300,
    adjustContent: 'center',
    //ajustar tamaño
  },
  inputContainer: {
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    height: 50,
  },
  containerRequerido: {
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    boxShadow: 5,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    height: 50,
    borderColor: 'red',
  },
  inputText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default LoginScreen;
