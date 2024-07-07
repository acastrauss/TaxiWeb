import { JWT } from "../models/Auth/JWT";

const LOCAL_STORAGE_KEY = "jwt_token";

function setJWT(jwt: JWT) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jwt));
}

function getJWT() {
    const jwtObj = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!jwtObj) {
        return null;
    }

    return JSON.parse(jwtObj);
}

export type JWTStorageType = {
    setJWT: (jwt: JWT) => void;
    getJWT: () => JWT | null;
}

export const JWTStorage: JWTStorageType = {
    setJWT,
    getJWT
}