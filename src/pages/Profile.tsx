import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { UserType } from '../models/Auth/UserType';
import { Input } from '../components/ui/Input';
import * as signalR from '@microsoft/signalr';
import { JWTStorage } from '../Services/JWTStorage';

interface Msg {
	UserEmail: string;
	Content: string;
	Timestamp: Date;
	ClientEmail: string;
	DriverEmail: string;
	RideCreadtedAtTimestamp: number;
}

interface Chat{
	ClientEmail: string;
	DriverEmail: string;
	RideCreadtedAtTimestamp: number;
	Messages: Msg[];
	Status: number;
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
							ClientEmail: "client@client.com",
							DriverEmail: "driver@driver.com",
							Messages: [] as any,
							RideCreadtedAtTimestamp: 638585483571007507,
							Status: 0
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
					ClientEmail: "client@client.com",
					DriverEmail: "driver@driver.com",
					RideCreadtedAtTimestamp: 638585483571007507,
					Content: message,
					Timestamp: new Date(),
					UserEmail: "client@client.com"					
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
				<li key={index}><strong>{msg.UserEmail}:</strong> {msg.Content}</li>
			))}
		</ul>
	</div>
    );
};

export default Profile;
