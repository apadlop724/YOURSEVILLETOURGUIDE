import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text,
  Button, 
  FlatList, 
  StyleSheet, 
  Alert, 
  Modal, 
  TextInput, 
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// Pantalla principal que muestra los tours del usuario, con opciones 
// para crear, eliminar y navegar a detalles
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tours'>;
};

/**
 * Pantalla de Listado de Tours 
 * 
 * Pantalla principal lista los tours del usuario tras el login.
 * con lógica para CRUD de tours.
 * - Permite crear, editar y eliminar tours (CRUD).
 * - Sirve para la navegación hacia el mapa detallado, el asistente IA y los reportes.
 * - Incluye la funcion  cerrar sesión.
 */
export default function ToursScreen({ navigation }: Props) {
  // Estados para los tours y el modal de creación
  const [tours, setTours] = useState<any[]>([]);
  // Estado para controlar la visibilidad del modal de creación de tour
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para el título del nuevo tour a crear
  const [newTourTitle, setNewTourTitle] = useState('');
  // Estado para la descripción del tour
  const [newTourDescription, setNewTourDescription] = useState('');
  // Estado para saber si estamos editando (guarda el ID del tour)
  const [editingId, setEditingId] = useState<string | null>(null);


  // --- NAVEGACIÓN Y LOGOUT ---
  // Función para cerrar sesión
  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Quieres salir?", [
      { text: "No" },
      { text: "Sí", onPress: async () => {
          await supabase.auth.signOut();
          navigation.replace('Register'); 
      }}
    ]);
  };
  

  // --- CRUD OPERACIONES ---
  // Cargamos los tours al montar el componente (SELECT)
  useEffect(() => {
    // Función para obtener los tours del usuario desde Supabase   
    async function fetchTours() {
      // Obtenemos los tours del usuario desde Supabase y actualizamos el estado
      const { data } = await supabase.from('tours').select('*');
      // Si hay datos, los actualizamos en el estado
      if (data) setTours(data);
    }
    // Llamamos a la función para cargar los tours al montar el componente
    fetchTours();
  }, []);

  

  // Función auxiliar para cerrar modal y limpiar estados
  const closeModal = () => {
    setModalVisible(false);
    setNewTourTitle('');
    setNewTourDescription('');
    setEditingId(null);
  };

  // Función para (Crear o Actualizar) (INSERT, UPDATE)
  const handleSaveTour = async () => {
    if (!newTourTitle.trim()) return;

    if (editingId) {
      // --- MODO EDICIÓN (UPDATE) ---
      const { data, error } = await supabase
      // Actualizamos el tour con el nuevo título, filtrando por el ID del tour 
      // que estamos editando, y ahora también la descripción
        .from('tours')
        .update({ title: newTourTitle, description: newTourDescription })
        .eq('id', editingId)
        .select();

      if (!error && data && data.length > 0) {
      // Si la actualización es exitosa, actualizamos el estado de tours reemplazando 
      // el tour editado con los nuevos datos
        setTours(tours.map(t => (t.id === editingId ? data[0] : t)));
        // Cerramos el modal y limpiamos estados
        closeModal();
      } else if (error) {
        Alert.alert('Error al actualizar', error.message);
      } else {
        Alert.alert('Permiso denegado', 'No puedes editar un tour que no creaste.');
      }
    } else {
      // --- MODO CREACIÓN (INSERT) ---
      // Obtenemos el usuario actual desde Supabase
      const user = (await supabase.auth.getUser()).data.user;
       // Insertamos el nuevo tour en Supabase y obtenemos los datos del tour creado
      const { data, error } = await supabase.from('tours').insert([
        { title: newTourTitle, description: newTourDescription, city: 'Sevilla', language: 'Español', created_by: user?.id }
      ]).select();

      if (!error && data) {
        setTours([...tours, data[0]]);
        closeModal();
      } else if (error) {
        Alert.alert('Error al crear', error.message);
      }
    }
  };

  // Función para preparar la edición
  const handleEdit = (item: any) => {
    setNewTourTitle(item.title);
    setNewTourDescription(item.description || '');
    setEditingId(item.id);
    setModalVisible(true);
  };

  // Función para eliminar un tour, con confirmación (DELETE)
  const handleDelete = async (id: string) => {
    Alert.alert("Borrar", "¿Eliminar tour?", [
      { text: "No" },
      { text: "Sí", onPress: async () => {//solo si es el creador del tour, puede borrarlo
          const { data, error } = await supabase.from('tours').delete().eq('id', id).select();
          if (!error && data && data.length > 0) {
            setTours(tours.filter(t => t.id !== id));
          } else if (error) {
            Alert.alert('Error al borrar', error.message);
          } else {
            Alert.alert('Permiso denegado', 'No puedes borrar un tour que no es tuyo.');
          }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER CON BOTONES DE CHAT Y SALIR */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Tours</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Asistente')} 
            style={styles.chatBtn}
          >
            <Text style={styles.chatBtnText}>✨Ir a IA Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTÓN PARA CREAR UN NUEVO TOUR */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ NUEVO TOUR</Text>
      </TouchableOpacity>

      {/* LISTADO DE TOURS */}
      <FlatList
      // El FlatList muestra los tours del estado, con un botón para ver el mapa 
      // y otro para borrar cada tour
        data={tours}
        // La clave de cada item es su id
        keyExtractor={item => item.id}
        // Renderizamos cada tour como una tarjeta con el título y botones 
        // para mapa y borrar
        renderItem={({ item }) => (          
          <View style={styles.card}>
            <Text style={styles.tourTitle}>{item.title}</Text>
            <View style={styles.cardActions}>

              {/* Botón para navegar al mapa detallado del tour, 
              pasando el id y título del tour */}
              <TouchableOpacity 
                onPress={() => navigation.navigate('MapaDetallado', { tourId: item.id, tourTitle: item.title })}
                style={styles.mapBtn}
              >
                <Text style={styles.btnTextWhite}>Mapa</Text>
              </TouchableOpacity>
              
              {/* Botón EDITAR  */}
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                <Text style={styles.btnTextWhite}>Editar</Text>
              </TouchableOpacity>

              {/* Botón BORRAR  pasando el id del tour */}
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODO CREACIÓN crear un nuevo tour, con un campo para el título y botones 
      // para cancelar o guardar el nuevo tour */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar Tour' : 'Nuevo Tour'}</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Triana Histórica"
              value={newTourTitle} 
              onChangeText={setNewTourTitle} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Descripción (opcional)"
              value={newTourDescription} 
              onChangeText={setNewTourDescription} 
            />
            <View style={styles.modalActions}>
              <Button title="Cancelar" color="red" onPress={closeModal} />
              <Button title="Guardar" onPress={handleSaveTour} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  chatBtn: { backgroundColor: '#6c5ce7', padding: 8, borderRadius: 8, marginRight: 15 },
  chatBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  logoutText: { color: '#ff7675', fontWeight: 'bold' },
  addBtn: { backgroundColor: '#00b894', margin: 15, padding: 15, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: 'white', marginHorizontal: 15, marginBottom: 10, padding: 15, borderRadius: 10, elevation: 2 },
  tourTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapBtn: { backgroundColor: '#0984e3', padding: 8, borderRadius: 5 },
  editBtn: { backgroundColor: '#f39c12', padding: 8, borderRadius: 5 },
  btnTextWhite: { color: 'white', fontWeight: 'bold' },
  deleteText: { color: '#fab1a0' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { margin: 20, backgroundColor: 'white', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 20, padding: 5 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around' }
});