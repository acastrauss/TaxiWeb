import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RoutesNames } from './Routes';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AuthService } from '../Services/AuthService';
import { JWTStorage } from '../Services/JWTStorage';
import { PrivateRoute } from './PrivateRoute';
import { BlobService } from '../Services/BlobService';
import NewRide from '../pages/NewRide';
import { RideService } from '../Services/RideService';
import NewRidesDriver from '../pages/NewRidesDriver';
import HomePage from '../pages/Home';
import PreviousRidesUser from '../pages/PreviousRidesUser';
import ProfilePage from '../pages/Profile';
import Chat from '../pages/Chat';
import { DriverService } from '../Services/DriverService';
import Verification from '../pages/Verification';

const router = createBrowserRouter([
	{
		path: '/',
		element: <PrivateRoute jwtStorage={JWTStorage} />,
		children: [
			{
				path: '',
				element: (
					<HomePage
						jwtService={JWTStorage}
						driverService={DriverService}
					/>
				),
				children: [
					{
						path: '/profile',
						element: <ProfilePage authService={AuthService} />,
					},
					{
						path: '/new-ride',
						element: (
							<NewRide
								rideService={RideService}
								driverService={DriverService}
							/>
						),
					},
					{
						path: '/new-rides',
						element: (
							<NewRidesDriver
								rideService={RideService}
								driverService={DriverService}
								jwtService={JWTStorage}
							/>
						),
					},
					{
						path: '/previous-rides-user',
						element: (
							<PreviousRidesUser rideService={RideService} />
						),
					},
					{
						path: '/chat',
						element: <Chat authService={AuthService} />,
          },
          {
						path: '/my-rides',
						element: (
							<PreviousRidesUser rideService={RideService} />
						),
					},
					{
						path: '/all-rides',
						element: (
							<PreviousRidesUser rideService={RideService} />
						),
					},
					{
						path: '/verification',
						element: <Verification driverService={DriverService} />,
					},
				],
			},
		],
	},
	{
		path: `/${RoutesNames.Login}`,
		element: (
			<LoginPage authService={AuthService} jwtStorage={JWTStorage} />
		),
	},
	{
		path: `/${RoutesNames.Register}`,
		element: (
			<RegisterPage authService={AuthService} blobService={BlobService} />
		),
	},
]);

export function Router() {
	return <RouterProvider router={router} />;
}
