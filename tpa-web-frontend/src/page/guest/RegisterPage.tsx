import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import style from '../css/RegisterPage.module.scss'
import { CREATE_USER } from '../../query/UserQuery'
import { useMutation } from '@apollo/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../component/Footer';

export default function RegisterPage() {

    const navigate = useNavigate()

    const toLogin = () => {
        navigate('/login')
    }

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [gender, setGender] = useState('')
    const [dob, setDOB] = useState<Date>()

    const [createUser, { data, loading, error }] = useMutation(CREATE_USER)

    const handleSignUp = () => {
        if (firstName != '' && lastName != '' && email != '' && password != '' && gender != '' && dob) {

            if (!email.endsWith('@gmail.com')) {
                toast.error('Email must ends with @gmail.com')
                return
            }
            if (password.length < 5) {
                toast.error('Password length must be more than 5 characters')
                return
            }
            const currentDate = new Date();
            const userDOB = new Date(dob);
            const ageDiff = currentDate.getFullYear() - userDOB.getFullYear();
            if (ageDiff < 8) {
                toast.error("You must be at least 8 years old to sign up.");
                return;
            }
            createUser({
                variables: {
                    inputUser: {

                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password,
                        gender: gender,
                        dob: dob
                    }
                }
            })

            console.log(data?.createUser, loading, error);

            if (!error) {
                toast.success('Activation email sent!')
                setTimeout(() => {
                    navigate('/login')
                }, 1500);
            }

        }
    }

    console.log(firstName, lastName, email, password, gender, dob);


    return (
        <div className={style['page-container']}>
            <h1>faREbook</h1>
            <div className={style['form-container']}>
                <div className={style['form-title']}>
                    <h3>Create a new account</h3>
                    <span>It's quick and easy.</span>
                </div>
                <hr />
                <div className={style['form-name']}>
                    <input type="text" placeholder='First name' onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder='Surname' onChange={(e) => setLastName(e.target.value)} />
                </div>
                <input type="text" placeholder='Email address' onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='New password' onChange={(e) => setPassword(e.target.value)} />
                <input type="date" onChange={(e) => setDOB(new Date(e.target.value))} />
                <div className={style['form-gender']}>
                    <div className={style['gender']}>
                        <label htmlFor="female-gender">Female</label>
                        <input type="radio" id='female-gender' name='gender' value="Female" onChange={(e) => setGender(e.target.value)} />
                    </div>
                    <div className={style['gender']}>
                        <label htmlFor="male-gender">Male</label>
                        <input type="radio" id='male-gender' name='gender' value="Male" onChange={(e) => setGender(e.target.value)} />
                    </div>
                </div>
                <p>People who use our service may have uploaded your contact information to <br /> Facebook</p>
                <p>By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. <br /> You may receive SMS notifications from us and can opt out at any time.</p>
                <button onClick={handleSignUp}>Sign Up</button>
                <a href="#" onClick={toLogin}>Already have an account?</a>
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