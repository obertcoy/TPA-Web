import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { CHANGE_PASSWORD, VERIFY_CHANGE_PASSWORD_TOKEN } from "../../query/UserQuery";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import style from '../css/ChangePasswordPage.module.scss';

export default function ChangePasswordPage() {

    const { forgotToken } = useParams();
    const [verifyToken, { error: verifyError }] = useMutation(VERIFY_CHANGE_PASSWORD_TOKEN);
    const [changePassword, { error: changePasswordError }] = useMutation(CHANGE_PASSWORD)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        verifyToken({
            variables: {
                email: localStorage.getItem('changeEmailPassword'),
                token: forgotToken
            }
        });

        if (verifyError) {
            toast.error('Token invalid')
            navigate('/login')
        }

    }, [forgotToken]);

    const toLogin = () => {
        localStorage.removeItem('changeEmailPassword')
        navigate('/login')
    }

    const handleChange = () => {
        if (password == '' || confirmPassword == '') {
            toast.error('Field must be filled')
        } else if (password != confirmPassword) {
            toast.error('Password and confirm password must match')
        } else {
            changePassword({
                variables: {
                    email: localStorage.getItem('changeEmailPassword'),
                    newPassword: password
                }
            })

        }
    }

    useEffect(() => {
        if (!changePasswordError) {
            navigate('/login')
            toast.success('Password changed successfuly!')
        } else {
            toast.error('Password changed failed')
        }
    }, [changePassword])

    return (
        <div className={style['page-container']}>
            <div className={style['form-container']}>
                <h3>Change Password</h3>
                <hr />
                <p>Please enter your new password for your account.</p>
                <input type="text" placeholder="New password" onChange={(e) => setPassword(e.target.value)} />
                <input type="text" placeholder="Confirm new password" onChange={(e) => setConfirmPassword(e.target.value)} />

                <hr />
                <div className={style['btn-container']}>
                    <button id={style['cancel-btn']} onClick={toLogin}>
                        Cancel
                    </button>
                    <button id={style['search-btn']} onClick={handleChange}>
                        Change Password
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
    );
}