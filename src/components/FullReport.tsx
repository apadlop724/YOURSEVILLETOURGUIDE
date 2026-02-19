import React from "react";
import { Button } from "react-native";
import { createAndSharePdf } from "../services/pdfService";

export default function FullReport() {
  const handlePress = async () => {
    const html = `
    <body style="font-family:Arial;padding:20px">

      <h1>Informe Biblioteca</h1>

      <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>

      <h2>Resumen</h2>
      <ul>
        <li>Total libros: 120</li>
        <li>Socios activos: 45</li>
        <li>Préstamos hoy: 8</li>
      </ul>

      <table border="1" width="100%" cellpadding="6">
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Socio</th>
        </tr>

        <tr>
          <td>1984</td>
          <td>Orwell</td>
          <td>Ana</td>
        </tr>

        <tr>
          <td>Dune</td>
          <td>Herbert</td>
          <td>Juan</td>
        </tr>

      </table>

    </body>
    `;

    await createAndSharePdf(html);
  };

  return <Button title="PDF Completo" onPress={handlePress} />;
}
