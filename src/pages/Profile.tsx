import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { UserType } from '../models/Auth/UserType';
import { Input } from '../components/ui/Input';
import * as signalR from '@microsoft/signalr';

interface Msg {
	user: string;
	message: string;
}

const Profile = () => {
	
	const [messages, setMessages] = useState<Msg[]>([]);
    const [connection, setConnection] = useState<signalR.HubConnection|null>(null);
	const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://localhost:9068/chathub`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.on("ReceiveMessage", (user: string, message: string) => {
                        setMessages(prevMessages => [...prevMessages, { user, message }]);
                    });
                })
                .catch(err => console.log('Connection failed: ', err));
        }
    }, [connection]);

	const sendMessage = async () => {
        if (connection && message) {
            try {
                await connection.invoke("SendMessage", user, message);
                setMessage('');
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
		<div>
		<input
			type="text"
			placeholder="User"
			value={user}
			onChange={(e) => setUser(e.target.value)}
		/>
		<input
			type="text"
			placeholder="Message"
			value={message}
			onChange={(e) => setMessage(e.target.value)}
		/>
		<button onClick={sendMessage}>Send</button>
		<ul>
			{messages.map((msg, index) => (
				<li key={index}><strong>{msg.user}:</strong> {msg.message}</li>
			))}
		</ul>
	</div>
    );
};

export default Profile;
