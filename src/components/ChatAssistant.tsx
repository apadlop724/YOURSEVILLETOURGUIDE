import React, {useState} from 'react';
import {View, Text, TextInput, Button, FlatList} from 'react-native';
import {sendMessageToRasa} from '../services/rasa';

type Message = {
	id: string;
	text: string;
};

export default function ChatAssistant() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');

	const sendMessage = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {id: Date.now().toString(), text: input};
		setMessages(prev => [...prev, userMessage]);
		setInput('');

		const botTexts = await sendMessageToRasa(input);

		const botMessages: Message[] = botTexts.map(text => ({
			id: Date.now().toString(),
			text,
		}));

		setMessages(prev => [...prev, ...botMessages]);
	};

	return (
		<View style={{flex: 1, padding: 20}}>
			<FlatList
				data={messages}
				keyExtractor={item => item.id}
				renderItem={({item}) => (
					<Text style={{marginVertical: 4}}>{item.text}</Text>
				)}
			/>

			<TextInput
				value={input}
				onChangeText={setInput}
				placeholder="Escribe..."
				style={{
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					marginVertical: 10,
					borderRadius: 5,
				}}
			/>

			<Button title="Enviar" onPress={sendMessage} />
		</View>
	);
}
