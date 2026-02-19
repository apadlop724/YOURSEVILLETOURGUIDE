import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, ActivityIndicator} from 'react-native';
import * as yup from 'yup';
import {supabase} from '../services/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

// Esquema de validación con Yup
const loginSchema = yup.object().shape({
  email: yup.string().email('Introduce un email válido').required('El email es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

// Pantalla de login con email y password, usando supabase para autenticación
/** validación con Yup
 * Permite a los usuarios acceder a la aplicación.
 * - Valida credenciales y autentica contra Supabase.
 * - Redirige a la pantalla de Tours tras un acceso exitoso.
 */
export default function LoginScreen({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Función para manejar el login
  const handleLogin = async () => {
    setErrorMsg('');

    try {
      await loginSchema.validate({email, password});
    } catch (error: any) {
      setErrorMsg(error.message);
      return;
    }

    setLoading(true);
    try {
      // Intentamos iniciar sesión con email y password
      const {error} = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      // Si hay un error, lanzamos excepción
      if (error) throw error;

      // Si el login es exitoso, navegamos a Tours (la pantalla principal actual)
      navigation.replace('Tours');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Vista de login con campos para email y password
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.label}>Email:</Text>
      {/* Campo de texto para email, con validación de formato y estilo básico */}
      <TextInput
      // El valor del campo de email se actualiza con setEmail
        value={email}
        // La función onChangeText se llama cada vez que el usuario escribe en el campo de email
        onChangeText={setEmail}
        //que no se auto-capitalice el email
        autoCapitalize="none"
        //que el teclado sea específico para email
        keyboardType="email-address"
        autoCorrect={false}
        placeholder="usuario@ejemplo.com"
        // Estilo básico para el campo de email
        style={styles.input}
      />
      <Text style={styles.label}>Password:</Text>
      {/* Campo de texto para password */}
      <TextInput
      // El valor del campo de password se actualiza con setPassword
        value={password}
        // La función onChangeText se llama cada vez que el usuario escribe en el campo de password
        onChangeText={setPassword}
        //que el texto sea oculto para password
        secureTextEntry
        placeholder="Contraseña"
        style={styles.input}
      />

      {/* Mensaje de error visible en rojo */}
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {/* Si está cargando mostramos el spinner, si no, los botones */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} />
          <View style={{height: 10}} />
          <Button title="Crear cuenta" onPress={() => navigation.navigate('Register')} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {fontSize: 18, marginBottom: 20, fontWeight: 'bold', textAlign: 'center'},
  label: {marginBottom: 5, fontWeight: 'bold'},
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
