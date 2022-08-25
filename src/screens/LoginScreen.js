import React, {useContext, useState} from 'react';
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Image,
  ScrollView
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

            <Button
              color={'orange'}
              title="Iniciar Sesión"
              onPress={() => {
                login(email, password);
              }}
            />
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
    marginTop: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
    marginTop: 40,
  },
  input: {
    textAlign: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
});

export default LoginScreen;
