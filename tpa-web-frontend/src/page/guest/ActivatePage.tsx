import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fb_verify from '../../assets/fb-verify.png';
import fb_invalid from '../../assets/fb-invalid.png';
import { useMutation } from '@apollo/client';
import { ACTIVATE_USER } from '../../query/UserQuery';
import style from '../css/ActivatePage.module.scss'

export default function ActivatePage() {

    const { activateToken } = useParams();
    const [activateUser, { data, error }] = useMutation(ACTIVATE_USER);
    const navigate = useNavigate()

    useEffect(() => {
        activateUser({ variables: { token: activateToken } });
    }, [activateToken]);
    
    const toLogin = () => {
        navigate('/login')
    }

    if (error) {
        return (

            <div className={style['page-container']}>
                <img src={fb_invalid} alt="Verification Failed"></img>
                <h2 id={style['h-failed']}>Token Invalid!</h2>
                <button onClick={toLogin}>Back</button>
            </div>
        )
    }

    if (data && data.activateUser) {
        return (
            <div className={style['page-container']}>
                <img src={fb_verify} alt="Verification Success"></img>
                <h2 id={style['h-success']}>Account Activated!</h2>
                <button onClick={toLogin}>Back</button>
            </div>
        );
    }

    return <div>Activating user...</div>;
}
