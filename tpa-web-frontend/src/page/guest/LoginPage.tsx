import { useState, useEffect } from 'react';
import style from '../css/LoginPage.module.scss'
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../query/UserQuery';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {

    const navigate = useNavigate()

    const toRegis = () => {
        navigate('/register')
    }

    const toForgot = () => {
        navigate('/forgot')
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginUser, { data, error }] = useMutation(LOGIN_USER)

    const handleLogin = () => {
        if (email !== '' && password !== '') {
            loginUser({
                variables: {
                    inputCredential: {
                        email: email,
                        password: password,
                    },
                },
            });
        } 
    };

    useEffect(() => {
        if (data?.loginUser && !error) {
            toast.success('Login successful!')
            sessionStorage.setItem( 'currentUser', JSON.stringify(data?.loginUser.user))
            sessionStorage.setItem('token', data?.loginUser.token);
            
            setTimeout(() => {
                navigate('/main/home'); 
              }, 1500);
        } else  if(error){
            toast.error('Wrong credential')
        }
    }, [data, error]);

    return (
        <div className={style['page-container']}>
            <div className={style['login-container']}>
                <div className={style['title-container']}>
                    <h1>faREbook</h1>
                    <h3>FaREbook helps you connect and share with the people in your life.</h3>
                </div>
                <div className={style['form-container']}>
                    <input type="text" placeholder='Email address' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <button id={style['login-btn']} onClick={handleLogin}>Log in</button>
                    <a href="" onClick={toForgot}>Forgotten password?</a>
                    <hr />
                    <button id={style['regis-btn']} onClick={toRegis}>Create new account</button>
                </div>
                <div className={style['footer']}>
                </div>

            </div>
            <ToastContainer position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" />
        </div>
    )

}