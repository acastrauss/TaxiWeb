import React, { useState } from 'react';
import styles from './NewRide.module.css';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const NewRide = () => {
	const [formData, setFormData] = useState({
		startAddress: '',
		endAddress: '',
	});
	const [isModalOpen, setModalOpen] = useState(false);

	const toggleModal = () => {
		setModalOpen(!isModalOpen);
	};

	const handleOrderClick = () => {
		console.log('Start Address:', formData.startAddress);
		console.log('End Address:', formData.endAddress);
		setFormData({ startAddress: '', endAddress: '' });
		toggleModal();
	};

	return (
		<>
			<div className={styles.container}>
				<h2 className={styles.heading}>Create a new Ride</h2>
				<div className={styles.formGroup}>
					<Input
						placeholder='Start Address'
						textValue={formData.startAddress}
						type='text'
						onChangeText={(val) => {
							setFormData((prevState) => ({
								...prevState,
								startAddress: val,
							}));
						}}
						isValid={true}
					/>
				</div>
				<div className={styles.formGroup}>
					<Input
						placeholder='End Address'
						textValue={formData.endAddress}
						type='text'
						onChangeText={(val) => {
							setFormData((prevState) => ({
								...prevState,
								endAddress: val,
							}));
						}}
						isValid={true}
					/>
				</div>
				<button onClick={handleOrderClick} className={styles.button}>
					Order
				</button>
			</div>
			<Modal isOpen={isModalOpen} onClose={toggleModal} title='My Modal'>
				<p>gas</p>
				<button onClick={toggleModal}>Close</button>
				<button>Accept ride</button>
			</Modal>
		</>
	);
};

export default NewRide;
