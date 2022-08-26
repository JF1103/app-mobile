import React, {useContext, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {isLoading, login} = useContext(AuthContext);

  return (
    <>
      <ScrollView>
        <Image
          style={styles.img}
          resizeMode="cover"
          source={require('./../assets/img/expo-bg1.png')}
        />
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <View style={styles.wrapper}>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
            />

            <TextInput
              style={styles.input}
              value={password}
              placeholder="Contraseña"
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />

            <TouchableOpacity style={styles.touch} onPress={() => {
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
  img: {
    width: 360,
    height: 240,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  wrapper: {
    width: '80%',
    marginTop: 40,
  },
  input: {
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#ffb74d',
    borderWidth: 1.0,
    fontWeight: 'bold',
    color: '#212121',
  },
  touch: {
    textAlign: 'center',
    marginBottom: 150,
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#b0bec5',
    borderWidth: 0.5,
    backgroundColor: '#ffb74d',
    height: 50,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#f5f5f5',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
