import React from "react";
import { Button } from "react-native";
import { createAndSharePdf } from "../services/pdfService";

export default function SimpleReport() {
  const handlePress = async () => {
    const prestamos = [
      { libro: "1984", socio: "Ana" },
      { libro: "Dune", socio: "Juan" }
    ];

    const filas = prestamos.map(p => `
      <tr>
        <td>${p.libro}</td>
        <td>${p.socio}</td>
      </tr>
    `).join("");

    const html = `
      <h1>Informe simple</h1>

      <table border="1" cellpadding="6">
        <tr>
          <th>Libro</th>
          <th>Socio</th>
        </tr>
        ${filas}
      </table>
    `;

    await createAndSharePdf(html);
  };

  return <Button title="PDF Simple" onPress={handlePress} />;
}
