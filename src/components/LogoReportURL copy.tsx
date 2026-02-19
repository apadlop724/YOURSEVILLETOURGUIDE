import React from 'react';
import {Button} from 'react-native';
import {createAndSharePdf} from '../services/pdfService';

//'https://raw.githubusercontent.com/pilarggomez/LibraryFormRN/refs/heads/main/assets/library-logo.jpg';
export default function LogoReportUrl() {
	const handlePress = async () => {
		const logoUrl =
			'https://raw.githubusercontent.com/pilarggomez/LibraryFormRN/refs/heads/main/assets/library-logo.jpg';

		const html = `
      <body style="font-family:Arial;padding:20px">

        <!-- HEADER -->
        <div style="display:flex;align-items:center;margin-bottom:20px">
          <img src="${logoUrl}" width="80" />

          <div style="margin-left:15px">
            <h1 style="margin:0">Biblioteca Central</h1>
            <p style="margin:0">Informe de préstamos</p>
          </div>
        </div>

        <hr/>

        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>

        <h2>Resumen</h2>
        <ul>
          <li>Total libros: 120</li>
          <li>Socios activos: 45</li>
          <li>Préstamos hoy: 8</li>
        </ul>

        <h2>Detalle de préstamos</h2>

        <table border="1" width="100%" cellpadding="6" cellspacing="0">
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Socio</th>
            <th>Fecha</th>
          </tr>

          <tr>
            <td>1984</td>
            <td>George Orwell</td>
            <td>Ana López</td>
            <td>01/02/2026</td>
          </tr>

          <tr>
            <td>Dune</td>
            <td>Frank Herbert</td>
            <td>Juan Pérez</td>
            <td>02/02/2026</td>
          </tr>
        </table>

        <br/>

        <p style="font-size:12px;color:gray">
          Documento generado automáticamente desde la app.
        </p>

      </body>
    `;

		await createAndSharePdf(html);
	};

	return <Button title="PDF con Logo (URL pública)" onPress={handlePress} />;
}
