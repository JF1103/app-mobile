import React, {useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import {AuthContext} from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import FormOne from './FormOne';
import {Ruta} from './Ruta';
import {FormProvider} from '../context/FormContext';
const Stack = createNativeStackNavigator();
import {TareasFinalizadas} from './tareasFinalizadas';

const Navigation = () => {
  const {userInfo, splashLoading} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <FormState>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          {splashLoading ? (
            <Stack.Screen
              name="Splash Screen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
          ) : userInfo.access_token ? (
            <Stack.Screen name="Home" component={HomeScreen} />
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
            </>
          )}
          <Stack.Screen
            name="FormOne"
            component={FormOne}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Ruta"
            component={Ruta}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TareasFinalizadas"
            component={TareasFinalizadas}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </FormState>
    </NavigationContainer>
  );
};

const FormState = ({children}) => {
  return <FormProvider>{children}</FormProvider>;
};

export default Navigation;
