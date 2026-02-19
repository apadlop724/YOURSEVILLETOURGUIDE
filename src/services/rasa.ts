const RASA_URL =
	'https://super-guide-5g5vw4rv46pxhp767-5005.app.github.dev/webhooks/rest/webhook';

//automatica https://refactored-space-dollop-r4qvrgr5wr4wh55pj-5005.app.github.dev/webhooks/rest/webhook
//nuestro nuevo https://studious-parakeet-pj4qgrg59pgwh9954-5005.app.github.dev/webhooks/rest/webhook

/*
Nota aseguratea de que Rasa este levantado
Activamos el entorno  
	source .venv/bin/activate
Levantamos el servidor Rasa para acceder desde fuera (App)
	rasa run --enable-api --cors "*" --debug
*/

export const sendMessageToRasa = async (message: string): Promise<string[]> => {
	try {
		const res = await fetch(RASA_URL, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				sender: 'mobile-user',
				message,
			}),
		});

		const data = await res.json();

		return data.map((msg: any) => msg.text);
	} catch (error) {
		console.error('Error conectando con Rasa:', error);
		return ['Error conectando con Rasa'];
	}
};
