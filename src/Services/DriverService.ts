import axios, { AxiosResponse } from 'axios';
import { DriverRating } from '../models/Ride';
import { JWTStorage } from './JWTStorage';

const backend = process.env.REACT_APP_BACKEND_URL;

async function RateDriver(driverRating: DriverRating) {
	const jtwToken = JWTStorage.getJWT();
	try {
		const res = await axios.post(
			`${backend}/driver/rate-driver`,
			driverRating,
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

export type DriverServiceType = {
	RateDriver: (
		driverRating: DriverRating
	) => Promise<null | AxiosResponse<any, any>>;
};

export const DriverService: DriverServiceType = {
	RateDriver,
};
