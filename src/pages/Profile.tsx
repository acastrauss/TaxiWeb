import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './Profile.module.css';
import { UserType } from '../models/Auth/UserType';
import { Input } from '../components/ui/Input';

const Profile = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		fullName: '',
		birthDate: '',
		address: '',
		userType: UserType.Admin,
		image: null as File | null,
	});

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFormData({
				...formData,
				image: e.target.files[0],
			});
		}
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(formData);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.formGroup}>
				<Input
					placeholder='Username'
					textValue={formData.username}
					type='text'
					onChangeText={(val) => {
						setFormData({
							...formData,
							username: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<Input
					placeholder='Email'
					textValue={formData.email}
					type='email'
					onChangeText={(val) => {
						setFormData({
							...formData,
							email: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<Input
					placeholder='Password'
					textValue={formData.password}
					type='password'
					onChangeText={(val) => {
						setFormData({
							...formData,
							password: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<Input
					placeholder='Full Name'
					textValue={formData.fullName}
					type='text'
					onChangeText={(val) => {
						setFormData({
							...formData,
							fullName: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<Input
					placeholder='Birth Date'
					textValue={formData.birthDate}
					type='date'
					onChangeText={(val) => {
						setFormData({
							...formData,
							birthDate: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<Input
					placeholder='Address'
					textValue={formData.address}
					type='text'
					onChangeText={(val) => {
						setFormData({
							...formData,
							address: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor='userType'>Tip korisnika</label>
				<select
					id='userType'
					name='userType'
					value={formData.userType}
					onChange={handleChange}
				>
					<option value={UserType.Admin}>Administrator</option>
					<option value={UserType.Client}>User</option>
					<option value={UserType.Driver}>Driver</option>
				</select>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor='image'>Upload Image</label>
				<input
					type='file'
					id='image'
					name='image'
					accept='image/*'
					onChange={handleImageChange}
				/>
			</div>
			{formData.image && (
				<div className={styles.imagePreview}>
					<img
						width={100}
						src={URL.createObjectURL(formData.image)}
						alt='Preview'
					/>
				</div>
			)}
			<button type='submit' className={styles.submitButton}>
				Submit
			</button>
		</form>
	);
};

export default Profile;
