import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MiddlewareMainProps {
    children: ReactNode;
}


export default function MiddlewareMain({children}: MiddlewareMainProps){

    const token = sessionStorage.getItem('token')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if(token == null){
            navigate('/login/')
        } else {
            setLoading(false)
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