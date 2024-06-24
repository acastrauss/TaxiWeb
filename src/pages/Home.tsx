import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesNames } from "../Router/Routes";

export function HomePage(){
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`../${RoutesNames.Login}`);
    }, [])

    return <></>
}