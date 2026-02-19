import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LogoReportUrl from '../components/LogoReportURL';

/**
 * Pantalla de Reportes 
 * 
 * se encargada de la visualización y generación de informes.
 * - Integra componentes para mostrar logotipos o recursos relacionados con documentos PDF.
 */
export default function ReportScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Generación de Documentos</Text>
			<View style={styles.separator} />
			<LogoReportUrl />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	separator: {
		height: 20,
	},
});
