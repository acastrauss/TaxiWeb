import {
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";
import { RoutesNames } from "./Routes";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },

]);

export function Router() {
    return (
        <RouterProvider router={router} />
    );
}
