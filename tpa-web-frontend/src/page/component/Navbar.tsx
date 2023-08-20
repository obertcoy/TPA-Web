import style from './css/Navbar.module.scss'
import fb_icon from '../../assets/fb-icon.png'
import { AiOutlineSearch, AiFillHome } from 'react-icons/ai'
import { LiaUserFriendsSolid } from 'react-icons/lia'
import { MdGroups, MdNotifications } from 'react-icons/md'
import { BsGrid3X3GapFill, BsFillDoorOpenFill } from 'react-icons/bs'
import { FaFacebookMessenger } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from './MasterLayout'
import { ShowUser, User } from '../../model/UserModel'
import { ADD_SPECIFIC_FRIEND, GET_USER, REMOVE_SPECIFIC_FRIEND } from '../../query/UserQuery'
import { useMutation, useQuery } from '@apollo/client'
import { GrClose } from 'react-icons/gr'
import { UserName } from '../../helper/UserHelper'
import { IoIosClose } from 'react-icons/io'


export default function Navbar() {

    const [activePage, setActivePage] = useState('home')
    const [profileOpen, setProfileOpen] = useState(false)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleNav = (page: string) => {
        setActivePage(page)
        navigate(`/main/${page}`)
    }

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    const handleOpenProfileCard = () => {
        setProfileOpen(!profileOpen)
    }

    const toChatPage = () => {
        navigate('/main/chats/')
    }

    const toNotificationPage = () =>{
        navigate('/main/notifications/')
    }
    
    const toSearchPage = () => {
        navigate(`/main/search/${search}`)
    }

    const user = getCurrentUser()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleSearch : React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            toSearchPage()
            setSearch('')
        }
    };

    return (
        <div className={style['container']}>

            {isModalOpen && <EditSpecificFriend user={user} handleOpenModal={handleOpenModal} />}

            <div className={style['navbar']}>
                <div className={style['navbar-left']}>
                    <img src={fb_icon} alt="" />
                    <div className={style['navbar-left-search']}>
                        <AiOutlineSearch id={style['search-icon']} />
                        <input type="text" placeholder='Search FaREbook' value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch} />
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
                        <FaFacebookMessenger className={style['right-icon']} onClick={toChatPage}/>
                    </div>
                    <div>
                        <MdNotifications className={style['right-icon']} onClick={toNotificationPage}/>
                    </div>

                    {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} onClick={handleOpenProfileCard} /> : <CgProfile className={style['profile-icon']} onClick={handleOpenProfileCard} />}

                </div>
            </div>
            <UserProfileCard user={user} profileOpen={profileOpen} handleLogout={handleLogout} handleOpenProfileCard={handleOpenProfileCard} handleOpenModal={handleOpenModal} />
        </div>
    )
}

interface UserCardProps {
    user: User | null
    profileOpen: boolean
    handleLogout: () => void
    handleOpenProfileCard: () => void
    handleOpenModal: () => void
}

function UserProfileCard({ user, profileOpen, handleLogout, handleOpenProfileCard, handleOpenModal }: UserCardProps) {

    const navigate = useNavigate()

    const toUserProfile = () => {
        navigate(`/main/profile/${user?.id}`)
        handleOpenProfileCard()
    }

    return (
        <div className={style['profile-card-container']} style={profileOpen ? { visibility: 'visible' } : { visibility: 'hidden' }}>
            <div>
                <div className={style['profile-card-subcontainer']}>
                    <div onClick={toUserProfile} className={style['name-card']}>
                        {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-image-icon']} /> : <CgProfile className={style['profile-image-icon']} />}
                        <h4>{user?.first_name ?? ""} {user?.last_name ?? ""}</h4>
                    </div>
                    <hr />
                    <div className={style['edit-card']} onClick={handleOpenModal}>
                        <h5>Edit specific friends</h5>
                    </div>
                </div>
            </div>
            <div onClick={handleLogout} className={style['logout-container']}>
                <BsFillDoorOpenFill className={style['profile-card-icon']} />
                <h5>Log out</h5>
            </div>
        </div>
    )

}

interface EditSpecificFriendProps {

    user: User | null
    handleOpenModal: () => void
}

function EditSpecificFriend({ user, handleOpenModal }: EditSpecificFriendProps) {

    const { data: userData, refetch } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: user?.id
        },
    })
    
    const [specificFriend, setSpecificFriend] = useState<ShowUser[]>([])
    const [searchFriend, setSearchFriend] = useState('');
    const filteredFriends = userData?.getUser.friend.filter(friend =>
        (friend.first_name + " " + friend.last_name).toLowerCase().includes(searchFriend.toLowerCase())
    ) || []

    const [addSpecificFriend] = useMutation(ADD_SPECIFIC_FRIEND)
    const [removeSpecificFriend] = useMutation(REMOVE_SPECIFIC_FRIEND)


    useEffect(() => {
        if (userData?.getUser.specificFriend) {
            setSpecificFriend(userData?.getUser.specificFriend)
        }
    }, [userData])

    const handleAddSpecificFriend = async(friendID: string) => {
        await addSpecificFriend({
            variables: {
                friendID: friendID
            }
        })
        refetch()
    }

    const handleRemoveSpecificFriend = async(friendID: string) => {
        await removeSpecificFriend({
            variables: {
                friendID: friendID
            }
        })
        refetch()
    }

    return (
        <div className={style['page-container']}>

            <div className={style['edit-specific-container']}>
                <div className={style['edit-specific-form-title']}>
                    <GrClose className={style['close-icon']} onClick={handleOpenModal} />
                    <h4>Edit Specific Friends</h4>
                </div>
                <hr />
                <div className={style['edit-specific-form-body']}>
                    <div className={style['edit-specific-search-container']}>
                        <div className={style['edit-specific-search']}>
                            <AiOutlineSearch id={style['search-icon']} />
                            <input type="text" placeholder='Search Friends' value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)} />
                        </div>
                        <h5 onClick={handleOpenModal}>Done</h5>
                    </div>
                    {specificFriend.length > 0
                        &&
                        <div className={style['specific-friend-container']}>
                            <h5>Current Specific Friends</h5>
                            <div className={style['specific-friend-container']}>
                                {specificFriend.map((user) => (
                                    <div key={user.id} className={style['specific-friend']}>
                                        {UserName(user)}
                                        <IoIosClose className={style['remove-icon']} onClick={() => handleRemoveSpecificFriend(user.id)} />
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                    }
                    <div className={style['user-card-container']}>
                        <h5>Suggestions</h5>
                        {
                            filteredFriends.length ?
                                filteredFriends.map((user) => (
                                    <div key={user.id} onClick={() => handleAddSpecificFriend(user.id)}>
                                        {user.profileImageURL ? <img src={user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                                        <h5>{UserName(user)}</h5>
                                    </div>
                                ))
                                : <h5 style={{ color: "gray" }}>No friends...</h5>
                        }
                    </div>
                </div>
            </div >
        </div>
    )
}