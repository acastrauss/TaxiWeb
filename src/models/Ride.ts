export interface EstimateRide {
	StartAddress: string;
	EndAddress: string;
}

export interface EstimateRideResponse {
	priceEstimate: number;
	timeEstimateSeconds: number;
}

export interface CreateRide {
	StartAddress: string;
	EndAddress: string;
	Price: number;
}

export interface CreateRideResponse {
	clientEmail: string;
	createdAtTimestamp: number;
	driverEmail: string | null;
	endAddress: string;
	price: number;
	startAddress: string;
	status: number;
	driveDuration: number;
}
