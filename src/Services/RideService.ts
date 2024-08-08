import axios, { AxiosResponse } from 'axios';
import { CreateRide, CreateRideResponse, EstimateRide } from '../models/Ride';
import { JWTStorage } from './JWTStorage';

const backend = process.env.REACT_APP_BACKEND_URL;

async function NewRide(estimateRide: EstimateRide) {
	const jtwToken = JWTStorage.getJWT();
	try {
		const res = await axios.post(
			`${backend}/ride/estimate-ride`,
			estimateRide,
			{
				headers: {
					Authorization: `Bearer ${jtwToken?.token}`,
				},
			}
		);
		console.log(res);
		return res;
	} catch {
		return null;
	}
}

async function CreateNewRide(createRide: CreateRide) {
	const jtwToken = JWTStorage.getJWT();
	try {
		const res = await axios.post(
			`${backend}/ride/create-ride`,
			createRide,
			{
				headers: {
					Authorization: `Bearer ${jtwToken?.token}`,
				},
			}
		);
		console.log(res);
		return res;
	} catch {
		return null;
	}
}

async function GetNewRides() {
	const jtwToken = JWTStorage.getJWT();
	try {
		const res = await axios.get(`${backend}/ride/get-new-rides`, {
			headers: {
				Authorization: `Bearer ${jtwToken?.token}`,
			},
		});
		console.log(res);
		return res.data;
	} catch {
		return null;
	}
}

export type RideServiceType = {
	NewRide: (
		estimateRide: EstimateRide
	) => Promise<null | AxiosResponse<any, any>>;
	CreateNewRide: (
		createRide: CreateRide
	) => Promise<null | AxiosResponse<any, any>>;
	GetNewRides: () => Promise<CreateRideResponse[] | null>;
};

export const RideService: RideServiceType = {
	NewRide,
	CreateNewRide,
	GetNewRides,
};
