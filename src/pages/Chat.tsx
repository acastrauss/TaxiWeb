import React, { FC, useEffect, useState } from 'react';
import styles from './Chat.module.css';
import Message from '../components/ui/Message';
import { AuthServiceType } from '../Services/AuthService';
import { UserType } from '../models/Auth/UserType';
import { Profile } from '../models/Auth/Profile';

interface ChatMessage {
	sender: string;
	content: string;
	timestamp: string;
}

interface IProps {
	authService: AuthServiceType;
}

const Chat: FC<IProps> = (props) => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [newMessage, setNewMessage] = useState<string>('');
	const [formData, setFormData] = useState<Profile>({
		username: '',
		email: '',
		password: '',
		fullname: '',
		dateOfBirth: '',
		address: '',
		type: UserType.Admin,
		imagePath: '' as string | File,
	});

	useEffect(() => {
		const fetchRides = async () => {
			const data = await props.authService.GetProfile();
			if (data) {
				console.log(data);
				setFormData(data);
			}
		};
		fetchRides();
	}, [props.authService]);

	const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newMessage.trim() !== '') {
			const newMsg: ChatMessage = {
				sender: formData.fullname,
				content: newMessage,
				timestamp: new Date().toLocaleTimeString(),
			};
			setMessages([...messages, newMsg]);
			setNewMessage('');
		}
	};

	return (
		<div className={styles.chatContainer}>
			<div className={styles.messagesContainer}>
				{messages.map((message, index) => (
					<Message
						key={index}
						sender={message.sender}
						content={message.content}
						timestamp={message.timestamp}
						isOwnMessage={message.sender === formData.fullname}
					/>
				))}
			</div>
			<form onSubmit={handleSend} className={styles.inputContainer}>
				<input
					type='text'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className={styles.input}
					placeholder='Type a message...'
				/>
				<button className={styles.button}>Send</button>
			</form>
		</div>
	);
};

export default Chat;
