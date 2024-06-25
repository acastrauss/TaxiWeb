import { useState } from "react"
import { RegisterData } from "../models/Auth/RegisterData"
import { Input } from "../components/ui/Input";
import { RadioButtonInput } from "../components/ui/RadioButton";
import { UserType } from "../models/Auth/UserType";
import styles from './RegisterPage.module.css'
import { ImageViewer } from "../components/ui/ImageViewer";
import { Button } from "../components/ui/Button";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const EMAIL_REGEX = /^[\w.+-]{3,}@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export function RegisterPage() {
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

        <Button text="Register" onClick={() => {}}/>

    </div>
}