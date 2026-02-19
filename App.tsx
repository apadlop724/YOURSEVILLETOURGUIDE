import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Register from './src/screens/RegisterScreen';
import ToursScreen from './src/screens/tourScreen';
import TourMapScreen from './src/screens/tourMapScreen';
import {SafeAreaView} from 'react-native';
import {Button} from 'react-native';
import ChatAssistant from './src/components/ChatAssistant';
import ReportScreen from './src/screens/ReportScreen';

// Tipado centralizado de la navegación
// Define los tipos de las rutas y sus parámetros
export type RootStackParamList = {
	// Cada pantalla y sus parámetros (si los hay)
	Register: undefined;
	Tours: undefined;
	// MapaDetallado recibe el tourId y tourTitle para mostrar el mapa específico
	MapaDetallado: {tourId: string; tourTitle: string};
	// Asistente no recibe parámetros
	Asistente: undefined;
	Reportes: undefined;
};

// Crea el Stack Navigator con el tipo definido
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente Raíz (App).
 * 
 * Configura la estructura principal de navegación de la aplicación.
 * - Define el Stack Navigator y todas las rutas disponibles.
 * - Establece el proveedor de área segura (SafeAreaProvider) para la UI.
 */
export default function App() {
/*
	return (
		<SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<LogoReportUrl />			
		</SafeAreaView>


	);
*/
	 /*
        <SafeAreaView>
            <ChatAssistant />
        </SafeAreaView>
    */

	return (
	// envuelve toda la aplicación para manejar las áreas seguras
	<SafeAreaProvider>
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Register">
				<Stack.Screen
					// pantalla de registro/login
					name="Register"
					component={Register}
					options={{title: 'Acceso'}}
				/>
				<Stack.Screen
					// pantalla principal que muestra los tours disponibles
					name="Tours"
					component={ToursScreen}
					options={({navigation}) => ({
						title: 'Tours en Sevilla',
						headerRight: () => (
							<Button
								onPress={() => navigation.navigate('Reportes')}
								title="Informes"
							/>
						),
					})}
				/>
				<Stack.Screen
					// pantalla que muestra el mapa detallado de la ruta seleccionada
					name="MapaDetallado"
					component={TourMapScreen}
					options={{title: 'Mapa de la Ruta'}}
				/>
				<Stack.Screen
					// pantalla del asistente turístico
					name="Asistente"
					component={ChatAssistant}
					options={{title: 'Asistente Turístico'}}
				/>
				<Stack.Screen
				// pantalla que muestra el informe PDF con el logo desde una URL pública
					name="Reportes"
					component={ReportScreen}
					options={{title: 'Generar Informes'}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	</SafeAreaProvider>
	);
}
