import { UserType } from './UserType';

export interface Profile {
	username: string;
	email: string;
	password: string;
	fullname: string;
	dateOfBirth: string;
	address: string;
	type: UserType;
	imagePath: string | File | null;
}
