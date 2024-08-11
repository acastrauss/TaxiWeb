import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { UserType } from '../models/Auth/UserType';
import { Input } from '../components/ui/Input';
import { Profile } from '../models/Auth/Profile';
import { AuthServiceType } from '../Services/AuthService';

interface IProps {
	authService: AuthServiceType;
}

const ProfilePage: FC<IProps> = (props) => {
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
				imagePath: e.target.files[0],
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
					textValue={formData.fullname}
					type='text'
					onChangeText={(val) => {
						setFormData({
							...formData,
							fullname: val,
						});
					}}
					isValid={true}
				/>
			</div>
			<div className={styles.formGroup}>
				<Input
					placeholder='Birth Date'
					textValue={formData.dateOfBirth}
					type='date'
					onChangeText={(val) => {
						setFormData({
							...formData,
							dateOfBirth: val,
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
					value={formData.type}
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
			{formData.imagePath && (
				<div className={styles.imagePreview}>
					<img
						width={100}
						src={
							formData.imagePath instanceof File
								? URL.createObjectURL(formData.imagePath)
								: formData.imagePath
						}
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

export default ProfilePage;
