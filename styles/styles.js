import {StyleSheet, StatusBar} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#00ff00',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: StatusBar.currentHeight || 0,
		//justifyContent: 'flex-start',
		padding: 20,
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 5,
		marginTop: 10,
		borderRadius: 5,
		marginVertical: 5,
		marginHorizontal: 16,
		fontSize: 33,
	},
	title: {
		fontSize: 30,
		color: 'black',
		fontWeight: 'bold',
		marginBottom: 10,
	},
	info: {
		fontSize: 18,
		marginBottom: 5,
		textAlign: 'center',
	},
	error: {
		color: 'red',
		fontSize: 18,
	},
	boton: {
		height: 40,
		width: '100%',
		backgroundColor: 'rgba(42,101,189,1)',
		padding: 14,
		borderRadius: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		height: 40,
		width: '100%',
		margin: 12,
		marginTop: 15,
		borderWidth: 1,
		paddingHorizontal: 10,
		borderColor: 'gray',
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
		marginBottom: 20,
	},
	botonMenos: {
		backgroundColor: 'red',
	},
	textBoton: {
		color: 'white',
		fontSize: 20,
		fontWeight: '600',
		marginLeft: 5,
	},
	entrada: {
		color: '#111fe6ff',
		fontSize: 20,
		borderWidth: 1,
		padding: 10,
		marginBottom: 10,
		borderColor: '#eae9ff',
	},
});
