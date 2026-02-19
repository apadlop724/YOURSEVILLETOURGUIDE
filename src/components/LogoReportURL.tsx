import React from 'react';
import {Button, Alert} from 'react-native';
import {createAndSharePdf} from '../services/pdfService';
import {supabase} from '../services/supabase';

export default function LogoReportUrl() {
	const handlePress = async () => {
		try {
			// 1. Consultar todos los Tours de la base de datos
			const {data: tours, error: toursError} = await supabase
				.from('tours')
				.select('*');

			if (toursError) throw toursError;

			// 2. Consultar todas las paradas (ordenadas)
			const {data: allStops, error: stopsError} = await supabase
				.from('stops')
				.select('*')
				.order('stop_order');

			if (stopsError) throw stopsError;

			const logoUrl =
				'https://www.serviciotecnicosevilla.com/iconoTour.png';

			// 3. Construir el contenido HTML dinámicamente
			// Recorremos cada tour y buscamos sus paradas correspondientes
			const toursHtml = tours
				?.map(tour => {
					// Filtramos las paradas que pertenecen a este tour
					const tourStops = allStops?.filter(s => s.tour_id === tour.id) || [];

					// Creamos las filas de la tabla para este tour
					const stopsRows =
						tourStops.length > 0
							? tourStops
									.map(
										stop => `
                    <tr>
                      <td><strong>${stop.title}</strong></td>
                      <td>${stop.description || ''}</td>
                    </tr>`,
									)
									.join('')
							: '<tr><td colspan="2"><i>Sin paradas registradas</i></td></tr>';

					// Retornamos el bloque HTML de este tour
					return `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
              <h2 style="color: #2980b9; border-bottom: 1px solid #ccc;">${tour.title}</h2>
              <p><em>${tour.description || 'Sin descripción'}</em></p>
              
              <table border="1" width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; margin-top:10px;">
                <tr style="background-color: #f2f2f2;">
                  <th align="left" width="30%">Parada</th>
                  <th align="left">Descripción</th>
                </tr>
                ${stopsRows}
              </table>
            </div>
          `;
				})
				.join('');

			const html = `
      <body style="font-family:Arial;padding:20px">

        <!-- HEADER -->
        <div style="display:flex;align-items:center;margin-bottom:20px">
          <img src="${logoUrl}" width="80" />
          <div style="margin-left:15px">
            <h1 style="margin:0">Informe de Rutas</h1>
            <p style="margin:0">Reporte completo de base de datos</p>
          </div>
        </div>

        <hr/>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>

        ${toursHtml || '<p>No hay tours disponibles.</p>'}

        <br/>
        <p style="font-size:12px;color:gray">
          Documento generado desde YourSevilleTourGuide.
        </p>

      </body>
    `;

			await createAndSharePdf(html);
		} catch (error: any) {
			Alert.alert('Error', 'No se pudo generar el informe: ' + error.message);
		}
	};

	return <Button title="Informe Tour " onPress={handlePress} />;
}
