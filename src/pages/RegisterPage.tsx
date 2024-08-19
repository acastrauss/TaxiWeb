import { FC, useState } from 'react';
import { RegisterData } from '../models/Auth/RegisterData';
import { Input } from '../components/ui/Input';
import { RadioButtonInput } from '../components/ui/RadioButton';
import { UserType } from '../models/Auth/UserType';
import styles from './RegisterPage.module.css';
import { ImageViewer } from '../components/ui/ImageViewer';
import { Button } from '../components/ui/Button';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/Regex';
import { AuthServiceType } from '../Services/AuthService';
import { useNavigate } from 'react-router-dom';
import { RoutesNames } from '../Router/Routes';
import { BlobServiceType } from '../Services/BlobService';
import { SHA256 } from 'crypto-js';
import { GoogleAuth } from '../components/auth/GoogleAuth';
import { GoogleAuthService } from '../Services/Google/GoogleAuth';

interface IProps {
	authService: AuthServiceType;
	blobService: BlobServiceType;
}

export const RegisterPage: FC<IProps> = (props) => {
	const navigate = useNavigate();

	const [registerFormData, setRegisterFormData] = useState({
		Username: '',
		Email: '',
		Password: '',
		FullName: '',
		Address: '',
		DateOfBirth: new Date().toUTCString(),
		Type: UserType.Client,
	} as RegisterData);

	const [localImagePath, setLocalImagePath] = useState<string | undefined>(
		undefined
	);
	const [localImageName, setLocalImageName] = useState<string | undefined>(
		undefined
	);
	const [usedGoogleAuth, setUsedGoogleAuth] = useState(false);

	const [registerFormValid, setRegisterFormValid] = useState({
		Username: true,
		Email: true,
		Password: true,
		FullName: true,
		DateOfBirth: true,
		Address: true,
		Type: true,
		ImagePath: true,
	});

	const isValid = () => {
		return (
			registerFormValid.Username &&
			registerFormValid.Email &&
			registerFormValid.Password &&
			registerFormValid.FullName &&
			registerFormValid.DateOfBirth &&
			registerFormValid.Address &&
			registerFormValid.Type &&
			registerFormValid.ImagePath
		);
	};

	async function onRegister() {
		if (!isValid() || !localImagePath || !localImageName) {
			alert('Please fill out the form');
			return;
		}

		const fetchedImg = await fetch(localImagePath);
		const blobImg = await fetchedImg.blob();
		const file = new File([blobImg], localImagePath);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('fileName', localImageName);
		const hashedEmail = SHA256(registerFormData.Email).toString();

		const uploadImgRes = await props.blobService.UploadProfileImage(
			formData,
			hashedEmail
		);

		if (!uploadImgRes) {
			alert('Failed uploading image.');
			return;
		}

		let registerDataSend = registerFormData;

		if (usedGoogleAuth) {
			registerDataSend.Password = undefined;
		} else {
			registerDataSend = {
				...registerFormData,
				ImagePath: uploadImgRes,
			};
		}

		const res = await props.authService.Register(registerDataSend);

		if (!res) {
			alert('Registration failed, please try different parameters.');
			return;
		}

		alert('Registration succesfull, please log in.');
		navigate(`../${RoutesNames.Login}`);
	}

	return (
		<div className={styles.form}>
			<ImageViewer
				alt='Profile image'
				imageUrl={localImagePath}
				setImageUrl={(url) => {
					setLocalImagePath(url);
				}}
				setLocalName={setLocalImageName}
			/>

			<Input
				isValid={registerFormValid.Username}
				onChangeText={(val) => {
					setRegisterFormData({ ...registerFormData, Username: val });
					setRegisterFormValid({
						...registerFormValid,
						Username: val.length >= 3,
					});
				}}
				placeholder='Username:'
				textValue={registerFormData.Username}
				type='text'
			/>

			<Input
				isValid={registerFormValid.Email}
				onChangeText={(val) => {
					setRegisterFormData({ ...registerFormData, Email: val });
					setRegisterFormValid({
						...registerFormValid,
						Email: EMAIL_REGEX.test(val),
					});
				}}
				placeholder='Email:'
				textValue={registerFormData.Email}
				type='text'
			/>

			{!usedGoogleAuth && (
				<Input
					isValid={registerFormValid.Password}
					onChangeText={(val) => {
						setRegisterFormData({
							...registerFormData,
							Password: val,
						});
						setRegisterFormValid({
							...registerFormValid,
							Password: PASSWORD_REGEX.test(val),
						});
					}}
					placeholder='Password:'
					textValue={registerFormData.Password ?? ''}
					type='password'
				/>
			)}

			<Input
				isValid={registerFormValid.FullName}
				onChangeText={(val) => {
					setRegisterFormData({ ...registerFormData, FullName: val });
					setRegisterFormValid({
						...registerFormValid,
						FullName: val.length > 3,
					});
				}}
				placeholder='Full Name:'
				textValue={registerFormData.FullName}
				type='text'
			/>

			<Input
				isValid={registerFormValid.DateOfBirth}
				onChangeText={(val) => {
					setRegisterFormData({
						...registerFormData,
						DateOfBirth: val,
					});
				}}
				placeholder='Date of Birth:'
				textValue={registerFormData.DateOfBirth}
				type='date'
			/>

			<Input
				isValid={registerFormValid.Address}
				onChangeText={(val) => {
					setRegisterFormData({ ...registerFormData, Address: val });
					setRegisterFormValid({
						...registerFormValid,
						Address: val.length > 3,
					});
				}}
				placeholder='Address:'
				textValue={registerFormData.Address}
				type='text'
			/>

			<RadioButtonInput
				selectedValue={UserType[registerFormData.Type]}
				setSelectedValue={(val) => {
					setRegisterFormData({
						...registerFormData,
						Type: UserType[val as keyof typeof UserType],
					});
				}}
				values={[UserType[1], UserType[2]]}
			/>

			<div>
				<GoogleAuth
					googleAuthService={GoogleAuthService}
					setUserInfo={(userInfo) => {
						setRegisterFormData({
							...registerFormData,
							Password: undefined,
							Email: userInfo.email,
							FullName: userInfo.name,
						});
						setRegisterFormValid({
							Address: registerFormData.Address.length > 3,
							DateOfBirth: true,
							Email: EMAIL_REGEX.test(userInfo.email),
							FullName: userInfo.name.length > 3,
							ImagePath: true,
							Password: true,
							Username: registerFormData.Username.length > 3,
							Type: true,
						});
						setLocalImagePath(userInfo.picture);
						setLocalImageName('image.png');
						setUsedGoogleAuth(true);
					}}
				/>
			</div>

			<a href='Login'>Already have an account? Log In</a>

			<Button text='Register' onClick={onRegister} />
		</div>
	);
};
