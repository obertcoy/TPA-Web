import { useNavigate } from 'react-router-dom';
import style from '../css/ForgotPage.module.scss';
import { useMutation } from '@apollo/client';
import { SEND_CHANGE_PASSWORD } from '../../query/UserQuery';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPage() {
    const navigate = useNavigate();
    const [sendChangePassword, { error }] = useMutation(SEND_CHANGE_PASSWORD);
    const [email, setEmail] = useState('');

    const toLogin = () => {
        navigate('/login');
    };

    const handleSearch = async () => {
        if (email !== '') {
            sendChangePassword({
                variables: {
                    email: email,
                },
            });
        }
        if (!error) {
            localStorage.setItem('changeEmailPassword', email)
            toast.success('Email sent successfully!');
        } else {
            toast.error('Error sending email. Email not found.');
        }
    }


    return (
        <div className={style['page-container']}>
            <div className={style['form-container']}>
                <h3>Find Your Account</h3>
                <hr />
                <p>Please enter your email address to search for your account.</p>
                <input type="text" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                <hr />
                <div className={style['btn-container']}>
                    <button id={style['cancel-btn']} onClick={toLogin}>
                        Cancel
                    </button>
                    <button id={style['search-btn']} onClick={handleSearch}>
                        Search
                    </button>
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
