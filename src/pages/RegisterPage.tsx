import { FC, useState } from "react"
import { RegisterData } from "../models/Auth/RegisterData"
import { Input } from "../components/ui/Input";
import { RadioButtonInput } from "../components/ui/RadioButton";
import { UserType } from "../models/Auth/UserType";
import styles from './RegisterPage.module.css'
import { ImageViewer } from "../components/ui/ImageViewer";
import { Button } from "../components/ui/Button";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/Regex";
import { AuthServiceType } from "../Services/AuthService";
import { useNavigate, useNavigation } from "react-router-dom";
import { RoutesNames } from "../Router/Routes";

interface IProps{
    authService: AuthServiceType
}

export const RegisterPage: FC<IProps> = (props) => {
    const navigate = useNavigate();

    const [registerFormData, setRegisterFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        FullName: '',
        Address: '',
        DateOfBirth: (new Date()).toUTCString(),
        Type: UserType.Client
    } as RegisterData);

    const [localImagePath, setLocalImagePath] = useState<string|undefined>(undefined);

    const [registerFormValid, setRegisterFormValid] = useState({
        Username: true,
        Email: true,
        Password: true,
        FullName: true,
        DateOfBirth: true,
        Address: true,
        Type: true,
        ImagePath: true
    });

    const isValid = () => {
        return registerFormValid.Username && 
            registerFormValid.Email && 
            registerFormValid.Password &&
            registerFormValid.FullName && 
            registerFormValid.DateOfBirth && 
            registerFormValid.Address && 
            registerFormValid.Type && 
            registerFormValid.ImagePath; 
    }

    async function onRegister() {
        if(!isValid()){
            alert("Please fill out the form");
            return;
        }

        const res = await props.authService.Register(registerFormData);

        if(!res){
            alert("Registration failed, please try different parameters.");
            return;
        }

        alert("Registration succesfull, please log in.");
        navigate(`../${RoutesNames.Login}`);
    }

    return <div className={styles.form}>
        <ImageViewer alt="Profile image" imageUrl={localImagePath} setImageUrl={(url) => {
            setLocalImagePath(url);
        }}/>

        <Input isValid={registerFormValid.Username} onChangeText={(val) => {
            setRegisterFormData({ ...registerFormData, Username: val });
            setRegisterFormValid({ ...registerFormValid, Username: val.length >= 3 });
        }} placeholder="Username:" textValue={registerFormData.Username} type="text" />

        <Input isValid={registerFormValid.Email} onChangeText={(val) => {
            setRegisterFormData({ ...registerFormData, Email: val });
            setRegisterFormValid({ ...registerFormValid, Email: EMAIL_REGEX.test(val) });
        }} placeholder="Email:" textValue={registerFormData.Email} type="text" />

        <Input isValid={registerFormValid.Password} onChangeText={(val) => {
            setRegisterFormData({ ...registerFormData, Password: val });
            setRegisterFormValid({ ...registerFormValid, Password: PASSWORD_REGEX.test(val) });
        }} placeholder="Password:" textValue={registerFormData.Password} type="password" />

        <Input isValid={registerFormValid.FullName} onChangeText={(val) => {
            setRegisterFormData({ ...registerFormData, FullName: val });
            setRegisterFormValid({ ...registerFormValid, FullName: val.length > 3 });
        }} placeholder="Full Name:" textValue={registerFormData.FullName} type="text" />

        <Input isValid={registerFormValid.DateOfBirth} onChangeText={(val) => {
            setRegisterFormData({ ...registerFormData, DateOfBirth: val });
        }} placeholder="Date of Birth:" textValue={registerFormData.DateOfBirth} type="date" />

        <Input isValid={registerFormValid.Address} onChangeText={(val) => {
            setRegisterFormData({ ...registerFormData, Address: val });
            setRegisterFormValid({ ...registerFormValid, Address: val.length > 3 });
        }} placeholder="Address:" textValue={registerFormData.Address} type="text" />

        <RadioButtonInput selectedValue={UserType[registerFormData.Type]} setSelectedValue={(val) => {
            setRegisterFormData({
                ...registerFormData,
                Type: UserType[val as keyof typeof UserType],
            });
        }} values={[UserType[1], UserType[2]]} />

        <a href="Login">Already have an account? Log In</a>

        <Button text="Register" onClick={onRegister}/>

    </div>
}