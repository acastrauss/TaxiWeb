import { FC, useState } from "react";
import { AuthType, LoginData } from "../models/Auth/LoginData";
import styles from './LoginPage.module.css';
import { Input } from "../components/ui/Input";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/Regex";
import { Button } from "../components/ui/Button";
import { AuthServiceType } from "../Services/AuthService";
import { JWT } from "../models/Auth/JWT";
import { JWTStorageType } from "../Services/JWTStorage";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../components/auth/GoogleAuth";
import { GoogleAuthService } from "../Services/Google/GoogleAuth";

interface IProps {
    authService: AuthServiceType
    jwtStorage: JWTStorageType
}

export const LoginPage: FC<IProps> = (props) => {
    const navigate = useNavigate();

    const [loginFormData, setLoginFormData] = useState({
        Email: '',
        Password: '',
        authType: AuthType.TRADITIONAL
    } as LoginData);

    const [loginFormValid, setLoginFormValid] = useState({
        Email: true,
        Password: true,
    });

    const isValid = () => {
        return loginFormValid.Email && loginFormValid.Password;
    }

    async function onLogin() {
        if (!isValid()) {
            alert("Please fill out the form");
            return;
        }

        const res = await props.authService.Login(loginFormData);

        if (!res) {
            alert("Invalid credentials.");
            return;
        }

        const jwt = res.data as JWT;
        props.jwtStorage.setJWT(jwt);
        navigate(`../`);
    }

    return <div className={styles.form}>
        <Input isValid={loginFormValid.Email} onChangeText={(val) => {
            setLoginFormData({ ...loginFormData, Email: val });
            setLoginFormValid({ ...loginFormValid, Email: EMAIL_REGEX.test(val) });
        }} placeholder="Email:" textValue={loginFormData.Email} type="text" />

        {loginFormData.authType === AuthType.TRADITIONAL && <Input isValid={loginFormValid.Password} onChangeText={(val) => {
            setLoginFormData({ ...loginFormData, Password: val });
            setLoginFormValid({ ...loginFormValid, Password: PASSWORD_REGEX.test(val) });
        }} placeholder="Password:" textValue={loginFormData.Password ?? ''} type="password" />
        }

        <div>
            <GoogleAuth googleAuthService={GoogleAuthService} setUserInfo={(userInfo) => {
                setLoginFormData({
                    Password: undefined,
                    Email: userInfo.email,
                    authType: AuthType.GOOGLE
                });
                setLoginFormValid({
                    ...loginFormValid,
                    Email: EMAIL_REGEX.test(userInfo.email),
                });
            }} />
        </div>
        <a href="Register">New here? Register</a>

        <Button text="Login" onClick={onLogin} />
    </div>
}