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
import Icon from 'react-native-vector-icons/Ionicons';

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

            <View style={styles.container2}>
            <TouchableOpacity style={styles.touch} onPress={() => {
                login(email, password);
              }}>
            <Icon style={styles.icon} name="person-circle-outline"/>
            <Text style={styles.text}>Iniciar Sesión</Text>
            </TouchableOpacity> 
            </View>

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
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderColor: '#000000',
    borderWidth: 0.5,
  },
  touch: {
    flex: 1,
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#000000',
    borderWidth: 0.5,
  },
  icon: {
    flex: 1,
    fontSize: 30,
    marginTop: 5,
    color: '#eeeeee',
    textAlign: 'center',
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
