import { useState } from 'react'
import style from '../css/FriendsPage.module.scss'
import { CgProfile, CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from '../component/MasterLayout'
import { IoMdPersonAdd } from 'react-icons/io'
import { User } from '../../model/UserModel'
import { ACCEPT_FRIEND_REQUEST, GET_USER, REJECT_FRIEND_REQUEST } from '../../query/UserQuery'


export default function FriendsPage() {


    const user = getCurrentUser()
    const navigate = useNavigate()

    const { data: userData, refetch: refetchUser } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: user?.id
        }
    })

    const toUserProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }
    const toAllFriends = () => {
        navigate(`/main/all-friends/`)
    }

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <h2>Friends</h2>
                    <hr />
                    <div style={{ backgroundColor: "var(--default-bg)" }}>
                        <IoMdPersonAdd className={style['sidebar-icon']} style={{ color: 'white', backgroundColor: "var(--default-blue-text)" }} />
                        <h4>Friend Requests</h4>
                    </div>
                    <div onClick={toAllFriends}>
                        <CgUserList className={style['sidebar-icon']} />
                        <h4>All Friends</h4>
                    </div>
                </div>

            </div>
            <div className={style['page-content']}>
                <h3 className={style['page-title']}>Friend Requests</h3>
                {userData?.getUser.pendingFriend.length ?
                    <div className={style['friend-request-card-container']}>
                        {userData?.getUser.pendingFriend.map((data) => (
                            <FriendRequestCard key={data.id} data={data} toUserProfile={toUserProfile} />
                        ))}
                    </div>
                    : <h4 className={style['no-request-text']} style={{ color: "gray" }}>No friend request...</h4>
                }
            </div>
            
        </div>
    )

}

interface NonFriendCardProps {
    data: User
    toUserProfile: (userID: string) => void
}

function FriendRequestCard({ data, toUserProfile }: NonFriendCardProps) {

    const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
        variables: {
            friendID: data.id
        }
    })
    const [rejectFriendRequest] = useMutation(REJECT_FRIEND_REQUEST, {
        variables: {
            friendID: data.id
        }
    })

    const [isVisible, setIsVisible] = useState(true)

    const handleAcceptFriendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        await acceptFriendRequest()
        setIsVisible(false)
    }

    const handleRejectFriendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        await rejectFriendRequest()
        setIsVisible(false)
    }

    return (
        <>
            {isVisible &&
                <div className={style['friend-request-card']} onClick={() => toUserProfile(data.id)}>
                    {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                    <div>
                        <h4>{data.first_name + " " + data.last_name}</h4>
                        <h5>mutuals friends</h5>
                        <button className={style['accept-btn']} onClick={(e) =>handleAcceptFriendRequest(e)}>Confirm</button>
                        <button className={style['reject-btn']} onClick={(e) =>handleRejectFriendRequest(e)}>Delete</button>

                    </div>

                </div>
            }
        </>
    )
}