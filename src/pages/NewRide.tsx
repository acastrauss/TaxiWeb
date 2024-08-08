import { FC, useState, useEffect } from 'react';
import styles from './NewRide.module.css';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import {
	CreateRide,
	CreateRideResponse,
	EstimateRide,
	EstimateRideResponse,
} from '../models/Ride';
import { RideServiceType } from '../Services/RideService';

interface IProps {
	rideService: RideServiceType;
}

const NewRide: FC<IProps> = (props) => {
	const [formData, setFormData] = useState<EstimateRide>({
		StartAddress: '',
		EndAddress: '',
	});
	const [newRide, setNewRide] = useState<CreateRide | null>(null);
	const [newRideResponse, setNewRideResponse] =
		useState<CreateRideResponse | null>(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [estimateResponse, setEstimateResponse] =
		useState<EstimateRideResponse | null>(null);
	const [arrivalTime, setArrivalTime] = useState<number | null>(null);
	const [rideDuration, setRideDuration] = useState<number | null>(null);
	const [isRideActive, setIsRideActive] = useState(false);

	const toggleModal = () => {
		setModalOpen(!isModalOpen);
	};

	const handleOrderClick = async () => {
		const response = await props.rideService.NewRide(formData);
		if (response !== null) {
			setEstimateResponse(response.data);
			toggleModal();
		}
	};

	const handleNewRideClick = async () => {
		setNewRide({
			StartAddress: formData.StartAddress,
			EndAddress: formData.EndAddress,
			Price: estimateResponse?.priceEstimate!,
		});
		setArrivalTime(estimateResponse?.timeEstimateSeconds!);
		setIsRideActive(true);
	};

	useEffect(() => {
		const createNewRide = async () => {
			if (newRide !== null) {
				const response = await props.rideService.CreateNewRide(newRide);
				setNewRideResponse(response?.data || null);
			}
		};
		createNewRide();
	}, [newRide, props.rideService]);

	useEffect(() => {
		let arrivalInterval: NodeJS.Timeout;
		let rideInterval: NodeJS.Timeout;

		if (arrivalTime !== null && arrivalTime > 0) {
			arrivalInterval = setInterval(() => {
				setArrivalTime((prevTime) =>
					prevTime !== null ? prevTime - 1 : null
				);
			}, 1000);
		}

		if (rideDuration !== null && rideDuration > 0) {
			rideInterval = setInterval(() => {
				setRideDuration((prevTime) =>
					prevTime !== null ? prevTime - 1 : null
				);
			}, 1000);
		}

		return () => {
			clearInterval(arrivalInterval);
			clearInterval(rideInterval);
		};
	}, [arrivalTime, rideDuration]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes} minutes and ${remainingSeconds} seconds`;
	};

	return (
		<>
			<div className={styles.container}>
				<h2 className={styles.heading}>Create a new Ride</h2>
				<div className={styles.formGroup}>
					<Input
						placeholder='Start Address'
						textValue={formData.StartAddress}
						type='text'
						onChangeText={(val) => {
							setFormData((prevState) => ({
								...prevState,
								StartAddress: val,
							}));
						}}
						isValid={true}
					/>
				</div>
				<div className={styles.formGroup}>
					<Input
						placeholder='End Address'
						textValue={formData.EndAddress}
						type='text'
						onChangeText={(val) => {
							setFormData((prevState) => ({
								...prevState,
								EndAddress: val,
							}));
						}}
						isValid={true}
					/>
				</div>
				<button
					onClick={handleOrderClick}
					className={styles.button}
					disabled={isRideActive}
				>
					Order
				</button>
			</div>
			{estimateResponse && (
				<Modal
					isOpen={isModalOpen}
					onClose={toggleModal}
					title='My Modal'
					disabled={isRideActive}
				>
					<p>Price: {estimateResponse.priceEstimate}</p>
					{arrivalTime === null && (
						<p>
							Estimate time{' '}
							{formatTime(estimateResponse.timeEstimateSeconds)}
						</p>
					)}
					<p>
						Real-time countdown to driver's arrival:{' '}
						{arrivalTime !== null
							? formatTime(arrivalTime)
							: 'Arrived'}
					</p>
					{rideDuration !== null && (
						<p>
							Real-time countdown to end of ride:{' '}
							{formatTime(rideDuration)}
						</p>
					)}
					<button onClick={toggleModal} disabled={isRideActive}>
						Close
					</button>
					<button
						onClick={handleNewRideClick}
						disabled={isRideActive}
					>
						Accept ride
					</button>
				</Modal>
			)}
		</>
	);
};

export default NewRide;
