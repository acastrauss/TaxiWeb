import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RoutesNames } from './Routes';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/Home';
import { AuthService } from '../Services/AuthService';
import { JWTStorage } from '../Services/JWTStorage';
import { PrivateRoute } from './PrivateRoute';
import { BlobService } from '../Services/BlobService';
import Profile from '../pages/Profile';
import NewRide from '../pages/NewRide';

const router = createBrowserRouter([
	{
		path: '/',
		// element: <PrivateRoute jwtStorage={JWTStorage}/>,
		children: [
			{
				path: '',
				element: <HomePage />,
				children: [
					{
						path: '/profile',
						element: <Profile />,
					},
					{
						path: '/new-ride',
						element: <NewRide />,
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
