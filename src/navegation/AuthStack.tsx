import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

// Creamos el stack de navegación para autenticación
const Stack = createNativeStackNavigator();

/**
 * Definimos la navegación stack para autenticación
 * 
 * gestiona la navegación para el flujo de entrada.
 * - Agrupa las pantallas de Login, Registro y Home en un Stack.
 * - Permite al usuario a autenticarse antes de entrar a la app principal.
 */
export default function AuthStack() {
  return (
    <NavigationContainer>
      // Configuramos las pantallas del stack de autenticación
      <Stack.Navigator screenOptions={{headerShown: true}}>
        // primero el login, luego el registro y finalmente la pantalla principal        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
