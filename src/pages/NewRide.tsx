import { FC, useState, useEffect } from 'react';
import styles from './NewRide.module.css';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import {
	CreateRide,
	CreateRideResponse,
	DriverRating,
	EstimateRide,
	EstimateRideResponse,
	GetRideStatusRequest,
	RideStatus,
	UpdateRideRequest,
} from '../models/Ride';
import { RideServiceType } from '../Services/RideService';
import Rating from '../components/ui/Rating';
import { DriverServiceType } from '../Services/DriverService';

interface IProps {
	rideService: RideServiceType;
	driverService: DriverServiceType;
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
	const [rideAccepted, setRideAccepted] = useState(false);
	const [isRatingOpen, setIsRatingOpen] = useState<boolean>(false);
	const [ratindDriverInformations, setRatingDriverInformation] =
		useState<DriverRating | null>(null);

	const toggleModal = () => {
		setModalOpen(!isModalOpen);
	};

	const toggleModalRating = () => {
		setIsRatingOpen(false);
	};

	const handleOrderClick = async () => {
		const response = await props.rideService.NewRide(formData);
		if (response !== null) {
			console.log(response);
			setEstimateResponse(response.data);
			toggleModal();
		}
	};

	const handleNewRideClick = async () => {
		setNewRide({
			StartAddress: formData.StartAddress,
			EndAddress: formData.EndAddress,
			Price: estimateResponse?.priceEstimate!,
			EstimatedDriverArrivalSeconds:
				estimateResponse?.estimatedDriverArrivalSeconds!,
		});
		setArrivalTime(estimateResponse?.estimatedDriverArrivalSeconds!);
		setIsRideActive(true);
	};

	useEffect(() => {
		const createNewRide = async () => {
			if (newRide !== null) {
				const response = await props.rideService.CreateNewRide(newRide);
				console.log(response);
				setNewRideResponse(response?.data || null);
			}
		};
		createNewRide();
	}, [newRide, props.rideService]);

	useEffect(() => {
		let arrivalInterval: NodeJS.Timeout | null = null;
		let rideInterval: NodeJS.Timeout | null = null;

		if (isRideActive && !rideAccepted) {
			const interval = setInterval(async () => {
				const request: GetRideStatusRequest = {
					ClientEmail: newRideResponse?.clientEmail!,
					RideCreatedAtTimestamp:
						newRideResponse?.createdAtTimestamp!,
				};
				const response = await props.rideService.GetRideStatus(request);

				if (response !== null) {
					const rideStatus: CreateRideResponse =
						response.data as CreateRideResponse;

					if (rideStatus.status === RideStatus.ACCEPTED) {
						setRideAccepted(true);
						clearInterval(interval);
						setRideDuration(
							convertToSecondsDifference(
								rideStatus.estimatedRideEnd!
							)
						);
						setArrivalTime(
							convertToSecondsDifference(
								rideStatus.estimatedDriverArrival
							)
						);

						setRatingDriverInformation({
							ClientEmail: rideStatus.clientEmail!,
							RideTimestamp: rideStatus.createdAtTimestamp!,
							DriverEmail: rideStatus.driverEmail!,
							Rating: 0!,
						});

						arrivalInterval = setInterval(() => {
							setArrivalTime((prevTime) => {
								if (prevTime !== null && prevTime > 0) {
									return prevTime - 1;
								} else {
									clearInterval(arrivalInterval!);

									if (!rideInterval) {
										rideInterval = setInterval(() => {
											setRideDuration((prevTime) =>
												prevTime !== null &&
												prevTime > 0
													? prevTime - 1
													: 0
											);
										}, 1000);
									}

									return 0;
								}
							});
						}, 1000);
					}
				}
			}, 5000);

			return () => clearInterval(interval);
		}

		return () => {
			if (arrivalInterval) {
				clearInterval(arrivalInterval);
			}
			if (rideInterval) {
				clearInterval(rideInterval);
			}
		};
	}, [
		isRideActive,
		rideAccepted,
		arrivalTime,
		rideDuration,
		newRideResponse,
		props.rideService,
	]);

	const handleRate = async (rating: number) => {
		console.log(`User rated: ${rating}`);
		if (ratindDriverInformations !== null) {
			const ratingRequest = {
				...ratindDriverInformations,
				Rating: rating,
			};
			try {
				await props.driverService.RateDriver(ratingRequest);
				toggleModalRating();
			} catch (error) {
				console.error('Failed to accept ride:', error);
				alert('Failed to accept ride.');
			}
		}
	};

	useEffect(() => {
		const finishRide = async () => {
			if (newRideResponse?.clientEmail !== undefined) {
				const updateRequest: UpdateRideRequest = {
					ClientEmail: newRideResponse?.clientEmail,
					RideCreatedAtTimestamp: newRideResponse?.createdAtTimestamp,
					Status: RideStatus.COMPLETED,
				};

				console.log(updateRequest);

				try {
					const response = await props.rideService.UpdateRideRequests(
						updateRequest
					);
					console.log(response);
					// if (response !== null) {
					// 	setArrivalTime(
					// 		convertToSecondsDifference(
					// 			response.data.estimatedDriverArrival
					// 		)
					// 	);
					// 	setRideDuration(
					// 		convertToSecondsDifference(
					// 			response.data.estimatedRideEnd
					// 		)
					// 	);
					// }
				} catch (error) {
					console.error('Failed to accept ride:', error);
					alert('Failed to accept ride.');
				}
			}
		};

		if (rideDuration === 0) {
			console.log('izdrsava se milion puta');
			finishRide();
			setIsRideActive(false);
			setModalOpen(false);
			setIsRatingOpen(true);
		}
	}, [rideDuration, newRideResponse, props.rideService]);
	console.log(rideDuration);

	const convertToSecondsDifference = (isoTimestamp: number): number => {
		const date = new Date(isoTimestamp);
		const now = new Date();
		const differenceInMilliseconds = date.getTime() - now.getTime();
		return Math.floor(differenceInMilliseconds / 1000);
	};

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
							{formatTime(
								estimateResponse.estimatedDriverArrivalSeconds
							)}
						</p>
					)}
					<p>
						Countdown to driver's arrival:{' '}
						{arrivalTime !== null ? formatTime(arrivalTime) : ''}
					</p>
					{rideDuration !== null && (
						<p>
							Countdown to end of ride: {formatTime(rideDuration)}
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
			{isRatingOpen && (
				<Modal
					isOpen={isRatingOpen}
					onClose={toggleModalRating}
					title='My Modal'
				>
					<h2>Leave us your rating for the ride!</h2>
					<Rating onRate={handleRate} />
				</Modal>
			)}
		</>
	);
};

export default NewRide;
