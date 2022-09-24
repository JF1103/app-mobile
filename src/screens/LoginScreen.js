import React, {useContext, useState} from 'react';
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
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {isLoading, login} = useContext(AuthContext);
  // console.log(email);
  // console.log(password);
  return (
    <>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <Image
            style={styles.img}
            resizeMode="cover"
            source={require('./../assets/img/expo-bg1.png')}
          />
          <View style={styles.wrapper}>
            <Text style={styles.subtitle}>Email</Text>
            <TextInput
              keyboardType="email-address"
              autoCompleteType="email"
              autoCorrect={false}
              autoFocus={true}
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
            />
            <Text style={styles.subtitle}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.touch}
              onPress={() => {
                login(email, password);
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
    height: windowHeight,
    backgroundColor: '#ffffff',
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
  img: {
    width: windowWidth * 0.99,
    height: windowHeight * 0.4,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 30,
  },
  wrapper: {
    width: '70%',
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
    color: '#000000',
    textAlign: 'center',
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
    elevation: 5,
    borderColor: '#fb8c00',
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  scroll: {
    backgroundColor: '#ffffff',
  },
});

export default LoginScreen;
