import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MiddlewareLoginProps {
    children: ReactNode;
}


export default function MiddlewareLogin({children}: MiddlewareLoginProps){

    const token = sessionStorage.getItem('token')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if(token == null){
            setLoading(false)
        } else {
            navigate('/main/home/')
        }
    }, [token])

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return(
        <div>
            {children}
        </div>
    )
}