import { UserType } from "./UserType";

export interface RegisterData{
    Username: string;
    Email: string;
    Password: string;
    FullName: string;
    DateOfBirth: Date;
    Address: string;
    Type: UserType;
    ImagePath: string;
}

export interface RegisterFormData extends RegisterData {
    ConfirmPassowrd: string;
}