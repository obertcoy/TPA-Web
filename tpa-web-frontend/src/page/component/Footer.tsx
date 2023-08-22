import style from './css/Footer.module.scss'
import { useNavigate } from "react-router-dom";

export default function Footer() {

    const navigate = useNavigate()

    return (
        <div className={style['footer-container']}>
            <div className={style['footer-content']}>
                <div>
                    <h6>English (UK)</h6>
                    <h6>Bahasa Indonesia</h6>
                    <h6>Basa Jawa</h6>
                    <h6>Bahasa Melayu</h6>
                    <h6>日本語</h6>
                    <h6>العربية</h6>
                    <h6>Français(France)</h6>
                    <h6>Español</h6>
                    <h6>한국어</h6>
                    <h6>Português (Brasil)</h6>
                    <h6>Deutsch</h6>
                </div>
                <hr />
                <div>
                    <h6 onClick={() => navigate('/register/')}>Sign Up</h6>
                    <h6 onClick={() => navigate('/login/')}>Log in</h6>
                    <a href="https://www.facebook.com/privacy/policy/?entry_point=facebook_page_footer" target='_blank'><h6>Privacy Policy</h6></a>
                    <a href="https://www.facebook.com/policies/cookies/" target='_blank'><h6>Cookies</h6></a>
                    <a href="https://www.facebook.com/policies?ref=pf" target='_blank'><h6>Terms</h6></a>
                    <a href="https://www.facebook.com/help/?ref=pf" target='_blank'><h6>Help</h6></a>
                </div>
            </div>
        </div>
    )

}