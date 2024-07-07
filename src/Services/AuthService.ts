import axios, { AxiosResponse } from "axios";
import { LoginData } from "../models/Auth/LoginData";
import { RegisterData } from "../models/Auth/RegisterData";
import sha256 from 'crypto-js/sha256';

const AUTH_CONTROLLER_URL = `${process.env.REACT_APP_BACKEND_URL}/auth`;


async function Login(loginData: LoginData) {
    try {
        loginData.Password = sha256(loginData.Password).toString();
        const res = await axios.post(`${AUTH_CONTROLLER_URL}/login`, {...loginData, Type: 0})
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function Register(registerData: RegisterData) {
    try {
        registerData.Password = sha256(registerData.Password).toString();
        const res = await axios.post(`${AUTH_CONTROLLER_URL}/register`, registerData)
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export type AuthServiceType = {
    Login: (loginData: LoginData) => Promise<null | AxiosResponse<any, any>>;
    Register: (registerData: RegisterData) => Promise<null | AxiosResponse<any, any>>;
}

export const AuthService: AuthServiceType = {
    Login,
    Register
}