import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert, StyleSheet, ActivityIndicator} from 'react-native';
import * as yup from 'yup';
import {supabase} from '../services/supabase';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';


type RegisterProps = {
	// El tipo de navegación se define usando NativeStackNavigationProp 
	// con el RootStackParamList y la pantalla 'Register'
	navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// Esquema de validación con Yup
const registerSchema = yup.object().shape({
	email: yup.string().email('Introduce un email válido').required('El email es obligatorio'),
	password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

/**
 * Pantalla de Registro 
 * validación con Yup
 * Gestiona el alta de nuevos usuarios en la aplicación.
 * - Valida el formulario de entrada (email/password).
 * - Crea el usuario en Supabase Auth e inserta su perfil inicial en la base de datos.
 * - También ofrece una opción rápida para iniciar sesión si ya se tiene cuenta.
 */
export default function Register({navigation}: RegisterProps) {
	// Estados para email y password
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	// Función para manejar el registro
	const handleRegister = async () => {
		setErrorMsg(''); // Limpiamos errores previos

		try {
			await registerSchema.validate({email, password});
		} catch (error: any) {
			setErrorMsg(error.message);
			return;
		}

		setLoading(true); // Activamos el spinner
		try {
			// Intentamos registrar el usuario con email y password
			const {data: authData, error: authError} = await supabase.auth.signUp({
				email: email.trim(),
				password,
			});

			// Si hay un error en el registro, mostramos un mensaje de error
			if (authError) throw authError;

			// Si el registro es exitoso
			if (authData.user) {
				// Insertamos el perfil con el email completo
				const {error: profileError} = await supabase.from('profiles').insert([
					{// El id del perfil es el mismo que el id del usuario registrado
						id: authData.user.id,
						// El nombre de usuario es el mismo que el email
						username: email.trim(),
					},
				]);

				// Si hay un error en la inserción del perfil, mostramos un mensaje de error
				if (profileError) throw profileError;
				// Si el perfil se crea correctamente, mostramos un mensaje de éxito y navegamos a Tours
				Alert.alert('Éxito', 'Usuario creado correctamente');
				navigation.replace('Tours');
				//navigation.navigate('Tours');
			}
		} catch (err: any) {
			Alert.alert('Error en registro', err.message);
			setErrorMsg(err.message);
		} finally {
			setLoading(false); // Desactivamos el spinner
		}
	};

	// Función para manejar el login
	const handleLogin = async () => {
		setErrorMsg('');

		try {
			await registerSchema.validate({email, password});
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
			//	 Si hay un error en el login, mostramos un mensaje de error
			if (error) throw error;
			// Si el login es exitoso, mostramos un mensaje de éxito y navegamos a Tours
			Alert.alert('Login exitoso', '¡Has iniciado sesión correctamente!');
			navigation.replace('Tours');
		} catch (err: any) {
			Alert.alert('Error en login', err.message);
			setErrorMsg(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		// Vista de registro con campos para email y password, y botones para registrar e iniciar sesión
		<SafeAreaView style={styles.container}>
			<Text style={styles.label}>Email:</Text>
			<TextInput
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
				autoCorrect={false}
				style={styles.input}
			/>
			<Text style={styles.label}>Contraseña:</Text>
			<TextInput
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.input}
			/>

			{/* Mensaje de error visible en rojo */}
			{errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

			{/* Si está cargando mostramos el spinner, si no, los botones */}
			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<>
					<Button title="Registrar" onPress={handleRegister} />
					<View style={{height: 10}} />
					<Button title="Entrar" onPress={handleLogin} color="#4CAF50" />
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', padding: 20},
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
