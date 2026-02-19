import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import {supabase} from '../services/supabase';

/**
 * Pantalla de Inicio (HomeScreen).
 * 
 * Componente que sirve como pantalla de bienvenida o placeholder.
 * - Proporciona una funcionalidad simple para cerrar la sesión actual.
 */
export default function HomeScreen({navigation}: any) {
  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      // Intentamos cerrar sesión
      const {error} = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error cerrando sesión', error.message);
      } else {
        // Si el cierre de sesión es exitoso, mostramos un mensaje de éxito y navegamos a Login
        Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente');
        navigation.replace('Login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // Vista de inicio con un botón para cerrar sesión
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 20, marginBottom: 20}}>Bienvenido a Home</Text>
      <Button title="Cerrar sesión" onPress={handleSignOut} />
    </View>
  );
}
