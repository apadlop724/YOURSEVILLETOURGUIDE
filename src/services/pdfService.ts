import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export async function createAndSharePdf(html: string) {
  try {
    const { uri } = await Print.printToFileAsync({ html });

    console.log("PDF creado:", uri);

    const available = await Sharing.isAvailableAsync();

    if (!available) {
      Alert.alert("Error", "Sharing no disponible");
      return;
    }

    await Sharing.shareAsync(uri);

  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo generar el PDF");
  }
}
