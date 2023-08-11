import style from './css/Navbar.module.scss'
import fb_icon from '../../assets/fb-icon.png'
import { AiOutlineSearch, AiFillHome } from 'react-icons/ai'
import { LiaUserFriendsSolid } from 'react-icons/lia'
import { MdGroups, MdNotifications } from 'react-icons/md'
import { BsGrid3X3GapFill,  BsFillDoorOpenFill } from 'react-icons/bs'
import { FaFacebookMessenger } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from './MasterLayout'
import { User } from '../../model/UserModel'


export default function Navbar() {

    const [activePage, setActivePage] = useState('home')
    const [profileOpen, setProfileOpen] = useState(false)
    const navigate = useNavigate()

    const handleNav = (page: string) => {
        setActivePage(page)
        navigate(`/main/${page}`)
        console.log(activePage);

    }

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }


    const handleOpenProfileCard = () => {
        setProfileOpen(!profileOpen)
    }

    const user = getCurrentUser()

    return (
        <div className={style['container']}>

            <div className={style['navbar']}>
                <div className={style['navbar-left']}>
                    <img src={fb_icon} alt="" />
                    <div className={style['navbar-left-search']}>
                        <AiOutlineSearch id={style['search-icon']} />
                        <input type="text" placeholder='Search FaREbook' />
                    </div>
                </div>
                <div className={style['navbar-mid']}>
                    <div className={activePage == 'home' ? style['nav-mid-active'] : ''} onClick={() => handleNav('home')}>
                        <AiFillHome className={style['mid-icon']} />
                    </div>
                    <div className={activePage == 'friends' ? style['nav-mid-active'] : ''} onClick={() => handleNav('friends')}>
                        <LiaUserFriendsSolid className={style['mid-icon']} />
                    </div>
                    <div className={activePage == 'groups' ? style['nav-mid-active'] : ''} onClick={() => handleNav('groups')}>
                        <MdGroups className={style['mid-icon']} />
                    </div>

                </div>
                <div className={style['navbar-right']}>
                    <div>
                        <BsGrid3X3GapFill className={style['right-icon']} />
                    </div>
                    <div>
                        <FaFacebookMessenger className={style['right-icon']} />
                    </div>
                    <div>
                        <MdNotifications className={style['right-icon']} />
                    </div>
                    
                    {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} onClick={handleOpenProfileCard} /> : <CgProfile className={style['profile-icon']} onClick={handleOpenProfileCard} />}

                </div>
            </div>
            <UserProfileCard user={user} profileOpen={profileOpen} handleLogout={handleLogout} />
        </div>
    )
}

interface UserCardProps {
    user: User | null
    profileOpen: boolean
    handleLogout : () => void
}

function UserProfileCard({ user, profileOpen, handleLogout }: UserCardProps) {

    
    return (
        <div className={style['profile-card-container']} style={profileOpen ? {visibility:'visible'} : {visibility:'hidden'}}>
            <div>
                {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-image-icon']}/> : <CgProfile className={style['profile-image-icon']} />}
                <h5>{user?.first_name ?? ""} {user?.last_name ?? ""}</h5>
            </div>
            <hr />
            <div onClick={handleLogout}>
                <BsFillDoorOpenFill className={style['profile-card-icon']}/>
                <h5>Log out</h5>
            </div>
        </div>
    )

}
