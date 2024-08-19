import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { UserType } from '../models/Auth/UserType';
import { Input } from '../components/ui/Input';
import * as signalR from '@microsoft/signalr';
import { JWTStorage } from '../Services/JWTStorage';

interface Msg {
	userEmail: string;
	content: string;
	timestamp: Date;
	clientEmail: string;
	driverEmail: string;
	rideCreadtedAtTimestamp: number;
}

interface Chat{
	clientEmail: string;
	driverEmail: string;
	rideCreadtedAtTimestamp: number;
	messages: Msg[];
	status: number;
}


const Profile = () => {
	
	const [messages, setMessages] = useState<Msg[]>([]);
    const [connection, setConnection] = useState<signalR.HubConnection|null>(null);
	const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://localhost:9068/chathub`, {
				accessTokenFactory: () => JWTStorage.getJWT()!.token
			})
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

		if(newConnection){
			
		}
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.on("ReceiveMessage", (userEmail: string, msg: Msg) => {
						console.log(msg)
                        setMessages(prevMessages => [...prevMessages, msg]);
                    });
					connection.on("CreateOrGetChat", (userEmail: string, chat: Chat) => {
						console.log('-------------------------')
						console.log(chat);
						console.log('-------------------------')
					});
					try {
						connection.invoke("CreateNewOrGetExistingChat", {
							clientEmail: "client@client.com",
							driverEmail: "driver@driver.com",
							messages: [] as any,
							rideCreadtedAtTimestamp: 638585483571007507,
							status: 0
						} as Chat);
					} catch (error) {
						console.error(error)
					}
                })
                .catch(err => console.log('Connection failed: ', err));
        }
    }, [connection]);

	const sendMessage = async () => {
        if (connection && message) {
            try {
                await connection.invoke("SendMessage", {
					clientEmail: "client@client.com",
					driverEmail: "driver@driver.com",
					rideCreadtedAtTimestamp: 638585483571007507,
					content: message,
					timestamp: new Date(),
					userEmail: "uzmi email iz jwta"					
				} as Msg);
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
				<li key={index}><strong>{msg.userEmail}:</strong> {msg.content}</li>
			))}
		</ul>
	</div>
    );
};

export default Profile;
