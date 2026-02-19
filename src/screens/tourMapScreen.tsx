import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Modal, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { supabase } from '../services/supabase';
import * as Speech from 'expo-speech';

// Coordenadas iniciales para centrar el mapa en Sevilla
const SEVILLA: Region = { latitude: 37.3891, longitude: -5.9845, latitudeDelta: 0.04, longitudeDelta: 0.04 };

/**
 * Pantalla de Mapa, mostrando las paradas del un Tour 
 * - Permite visualizar la ruta y las paradas.
 * - Permite (CRUD) crear (pulsación larga), editar y borrar de paradas.
 * - Integra reproducción de audio para las paradas.
 */
export default function TourMapScreen({ route, navigation }: any) {
  // Obtenemos el ID y título del tour desde los parámetros de navegación 
  const { tourId, tourTitle } = route.params;
  // Estados para las paradas
  const [stops, setStops] = useState<any[]>([]);
  // Estado para controlar la visibilidad del modal de creación de parada
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para almacenar temporalmente las coordenadas de la nueva parada
  const [tempCoords, setTempCoords] = useState<any>(null);
  // Estado para el nombre de la nueva parada a crear
  const [stopName, setStopName] = useState('');
  // Estado para la descripción de la parada
  const [stopDescription, setStopDescription] = useState('');
  // Estado para saber si estamos editando una parada (guarda su ID)
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  // Estado para controlar si el audio está pausado
  const [isPaused, setIsPaused] = useState(false);

  // --- CRUD DE PARADAS (Stops) ---
  // Cargamos las paradas del tour al montar el componente y cada vez que cambie el tourId
  useEffect(() => { fetchStops(); }, [tourId]);
// Función para obtener las paradas del tour desde Supabase (SELECT)
  async function fetchStops() {
    const { data } = await supabase.from('stops').select('*').eq('tour_id', tourId).order('stop_order');
    if (data) setStops(data);
  }

  // Detener el audio cuando se cierra el modal o se desmonta el componente
  useEffect(() => {
    if (!modalVisible) {
      Speech.stop();
      setIsPaused(false);
    }
    return () => { Speech.stop(); };
  }, [modalVisible]);

  // Función auxiliar para cerrar modal y limpiar estados
  const closeModal = () => {
    setModalVisible(false);
    setStopName('');
    setStopDescription('');
    setEditingStopId(null);
    setTempCoords(null);
    setIsPaused(false);
  };

  // Función para manejar el evento de pulsación larga en el mapa, que abre el modal 
  // de creación de parada
  const handleLongPress = (e: any) => {
    setTempCoords(e.nativeEvent.coordinate);
    setEditingStopId(null); // Aseguramos que no estamos editando
    setStopName('');
    setStopDescription('');
    // Abrimos el modal para crear una nueva parada en las coordenadas pulsadas
    setModalVisible(true);
  };

  // Función para preparar la edición de una parada existente
  const handleEdit = (stop: any) => {
    setStopName(stop.title);
    setStopDescription(stop.description || '');
    setEditingStopId(stop.id);
    setModalVisible(true);
  };

  // Función para guardar una nueva parada (INSERT) o actualizarla (UPDATE)
  const saveStop = async () => {
    if (!stopName.trim()) return;

    if (editingStopId) {
      // --- MODO EDICIÓN (UPDATE) ---
      const { data, error } = await supabase
        .from('stops')
        .update({ title: stopName, description: stopDescription })
        .eq('id', editingStopId)
        .select();

      if (!error && data && data.length > 0) {
        // Actualizamos la lista local
        setStops(stops.map(s => (s.id === editingStopId ? data[0] : s)));
        closeModal();
      } else if (error) {
        Alert.alert('Error al actualizar', error.message);
      } else {
        Alert.alert('Permiso denegado', 'No puedes editar esta parada.');
      }
    } else {
      // --- MODO CREACIÓN (INSERT) ---
      const { data, error } = await supabase.from('stops').insert([{
        // Insertamos una nueva parada con el tour_id del tour actual, el título del stop, 
      // las coordenadas y el orden de la parada (último + 1)
        tour_id: tourId,
        title: stopName,
        description: stopDescription,
        latitude: tempCoords.latitude,
        longitude: tempCoords.longitude,
        stop_order: stops.length + 1
      }]).select();
       // Si la inserción es exitosa, actualizamos el estado de paradas añadiendo la nueva parada
      if (!error && data) {
        setStops([...stops, data[0]]);
        closeModal();
      } else if (error) {
        Alert.alert('Error al crear', error.message);
      }
    }
  };

  // Función para eliminar una parada, con confirmación (DELETE)
  const deleteStop = (id: string) => {
    Alert.alert("Borrar Parada", "¿Eliminar este punto?", [
      { text: "No" },
      { text: "Sí", style: 'destructive', onPress: async () => {
        // Si el usuario confirma, eliminamos la parada de Supabase y actualizamos 
        // el estado de paradas filtrando la parada eliminada
        // Solo el creador del tour puede eliminar paradas, así que verificamos que la eliminación
          const { data, error } = await supabase.from('stops').delete().eq('id', id).select();
          if (!error && data && data.length > 0) {
            setStops(stops.filter(s => s.id !== id));
            closeModal(); // Cerramos el modal si estaba abierto
          } else if (error) {
            Alert.alert('Error al borrar', error.message);
          } else {
            Alert.alert('Permiso denegado', 'No puedes borrar esta parada.');
          }
      }}
    ]);
  };

  return (
    // Vista principal con el mapa, las paradas como marcadores y la polilínea que une 
    // las paradas
    <View style={{ flex: 1 }}>
      {/* BARRA SUPERIOR PERSONALIZADA */}
      <View style={styles.headerBar}>        
        <Text style={styles.headerTitle}>{tourTitle}</Text>
      </View>

      {/* MODAL PARA CREAR O EDITAR PARADA */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalCentered}>
          <View style={styles.modalBox}>
            <Text style={styles.label}>{editingStopId ? 'Editar Parada' : 'Nueva Parada'}</Text>
            <TextInput style={styles.input} 
              onChangeText={setStopName} 
              value={stopName}
              autoFocus placeholder="Ej: La Giralda" />
            <TextInput style={styles.input} 
              onChangeText={setStopDescription} 
              value={stopDescription}
              placeholder="Descripción de la parada" />

            {/* CONTROLES DE AUDIO (EXPO SPEECH) */}
            <View style={styles.audioContainer}>
              <Text style={styles.label}>Audio Guía</Text>
              <View style={styles.audioRow}>
                <TouchableOpacity style={styles.audioBtn} onPress={() => {
                  Speech.stop(); // Detenemos cualquier audio previo antes de empezar
                  setIsPaused(false);
                  Speech.speak(`${stopName}. ${stopDescription || 'Sin descripción'}`, { language: 'es-ES' });
                }}>
                  <Text>▶️ Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioBtn} onPress={() => {
                  if (isPaused) {
                    Speech.resume();
                    setIsPaused(false);
                  } else {
                    Speech.pause();
                    setIsPaused(true);
                  }
                }}>
                  <Text>{isPaused ? "⏯️ Reanudar" : "⏸️ Pausa"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioBtn} onPress={() => {
                  Speech.stop();
                  setIsPaused(false);
                }}>
                  <Text>⏹️ Stop</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Button title="Guardar" onPress={saveStop} />
              <Button title="Cancelar" color="gray" onPress={closeModal} />
              {/* Si estamos editando, mostramos también el botón de borrar aquí */}
              {editingStopId && (
                <Button title="Borrar" color="red" onPress={() => deleteStop(editingStopId)} />
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Mapa con las paradas como marcadores y una polilínea que une las paradas en orden */}
      <MapView 
        style={styles.map} 
        // El mapa se centra en Sevilla inicialmente, pero el usuario puede moverse libremente
        initialRegion={SEVILLA}
        // Al hacer una pulsación larga en el mapa, se abre el modal para crear una nueva parada
        onLongPress={handleLongPress}
      >
        {/* Renderizamos cada parada como un marcador en el mapa */}
        {stops.map((stop) => (
          /* Cada parada se muestra como un marcador con su título */
          <Marker 
          // La clave de cada marcador es el ID de la parada, y sus coordenadas se obtienen 
          // de la parada
            key={stop.id} 
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }} 
            title={stop.title}
            description={stop.description || "Pulsa para editar"}
            // Al pulsar el callout (burbuja), abrimos el modo edición
            onCalloutPress={() => handleEdit(stop)}
          />
        ))}
        <Polyline coordinates={stops} strokeWidth={4} strokeColor="#2196F3" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  headerBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 40, // Para evitar el notch del móvil
    paddingBottom: 15, 
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  backButton: { padding: 5 },
  backButtonText: { color: '#2196F3', fontWeight: 'bold', fontSize: 16 },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginRight: 50 },
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalBox: { width: '80%', backgroundColor: 'white', padding: 25, borderRadius: 15 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: { borderBottomWidth: 2, borderBottomColor: '#2196F3', marginBottom: 25, padding: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  audioContainer: { marginBottom: 20, alignItems: 'center', width: '100%' },
  audioRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  audioBtn: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 5 }
});