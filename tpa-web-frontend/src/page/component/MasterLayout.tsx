import { ReactNode } from "react";
import Navbar from "./Navbar";
import style from './css/MasterLayout.module.scss'
import { User } from "../../model/UserModel";

interface MasterLayoutProps {
    children: ReactNode;
}

export function getCurrentUser() {
    const currentUserString = sessionStorage.getItem('currentUser');
    
    if (currentUserString) {
        try {
            return JSON.parse(currentUserString) as User;
        } catch (error) {
            console.error('Error parsing currentUser', error);
        }
    }
    return null;
}

export default function MasterLayout({ children }: MasterLayoutProps) {
    return (
        <div className={style['page-container']}>
            <Navbar />
            <div className={style['children-container']}>
                {children}
            </div>
        </div>
    )
}