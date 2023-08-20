import { useState } from 'react'
import style from './css/FriendsNavbar.module.scss'
import { CgProfile } from 'react-icons/cg'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from './MasterLayout'
import { ShowUser, User } from '../../model/UserModel'
import { GET_USER } from '../../query/UserQuery'
import { BiArrowBack } from 'react-icons/bi'
import FriendProfile from './FriendProfile'
import { AiOutlineSearch } from 'react-icons/ai'


export default function FriendsNavbar() {


    const user = getCurrentUser()
    const navigate = useNavigate()

    const [selectedFriendID, setSelectedFriendID] = useState('')
    const [searchFriend, setSearchFriend] = useState('');

    const { data: userData } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: user?.id
        },
    })

    const toFriendProfile = (friendID: string) => {
        setSelectedFriendID(friendID)
    }

    const filteredFriends = userData?.getUser.friend.filter(friend => 
        (friend.first_name + " " + friend.last_name).toLowerCase().includes(searchFriend.toLowerCase())
    ) || []

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <div className={style['sidebar-profile-title']}>
                        <BiArrowBack id={style['back-icon']} onClick={() => navigate('/main/friends')} />
                        <div>
                            <h6>Friends</h6>
                            <h2>All Friends</h2>
                        </div>
                    </div>
                    <div className={style['sidebar-search']}>
                        <AiOutlineSearch id={style['search-icon']} />
                        <input type="text" placeholder='Search Friends' value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)}/>
                    </div>
                    <hr />
                    <div className={style['friend-profile-nav-container']}>
                        <h4>{filteredFriends.length} friends</h4>
                        {filteredFriends.length ?
                            filteredFriends.map((data) => (
                                <FriendProfileNavCard key={data.id} data={data} toFriendProfile={toFriendProfile} />
                            ))
                            : <h4 style={{ color: 'gray', margin: 'auto' }}>No friends...</h4>
                        }
                    </div>
                </div>

            </div>
            <div className={style['page-content']} style={{ margin: '0' }}>
                {selectedFriendID != ''
                    ?
                    <FriendProfile userID={selectedFriendID} />
                    :
                    <h3 style={{ color: 'gray', marginTop: '50vh', marginLeft: '60vw' }}>Select a profile</h3>
                }
            </div>

        </div>
    )

}

interface FriendProfileNavCardProps {
    data: ShowUser
    toFriendProfile: (friendID: string) => void
}

function FriendProfileNavCard({ data, toFriendProfile }: FriendProfileNavCardProps) {

    return (
        <div className={style['card-body-profile']} onClick={() => toFriendProfile(data.id)}>
            {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div>
                <h5>{data.first_name + " " + data.last_name}</h5>
                <h6>mutual friends</h6>
            </div>
        </div>
    )
}


