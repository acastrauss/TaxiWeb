import { FC, useEffect, useState } from 'react';
import styles from './NewRidesDriver.module.css';
import { RideServiceType } from '../Services/RideService';
import { CreateRideResponse } from '../models/Ride';
import { JWTStorage, JWTStorageType } from '../Services/JWTStorage';

interface IProps {
	rideService: RideServiceType;
}

const NewRidesDriver: FC<IProps> = (props) => {
	const [rideData, setRideData] = useState<CreateRideResponse[]>([]);

	useEffect(() => {
		const fetchRides = async () => {
			const data = await props.rideService.GetNewRides();
			if (data) {
				setRideData(data);
			}
		};
		fetchRides();
	}, []);

	const formatTimestamp = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleString();
	};

	return (
		<div className={styles.tableContainer}>
			<table className={styles.table}>
				<thead>
					<tr className={styles.row}>
						<th className={styles.headerCell}>Created At</th>
						<th className={styles.headerCell}>Start Address</th>
						<th className={styles.headerCell}>End Address</th>
						<th className={styles.headerCell}>Client Email</th>
						<th className={styles.headerCell}>Driver Email</th>
						<th className={styles.headerCell}>Status</th>
						<th className={styles.headerCell}>Price</th>
						<th className={styles.headerCell}>Accept</th>
					</tr>
				</thead>
				<tbody>
					{rideData.map((ride) => (
						<tr
							className={styles.row}
							key={ride.createdAtTimestamp}
						>
							<td className={styles.dataCell}>
								{formatTimestamp(ride.createdAtTimestamp)}
							</td>
							<td className={styles.dataCell}>
								{ride.startAddress}
							</td>
							<td className={styles.dataCell}>
								{ride.endAddress}
							</td>
							<td className={styles.dataCell}>
								{ride.clientEmail}
							</td>
							<td className={styles.dataCell}>
								{ride.driverEmail ? ride.driverEmail : 'N/A'}
							</td>
							<td className={styles.dataCell}>{ride.status}</td>
							<td className={styles.dataCell}>{ride.price}</td>
							<td className={styles.dataCell}>
								<button type='button'>Accept</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default NewRidesDriver;
