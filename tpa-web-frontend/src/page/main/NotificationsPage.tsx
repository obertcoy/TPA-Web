import { useMutation, useQuery } from "@apollo/client"
import style from '../css/NotificicationPage.module.scss'
import { GET_USER_NOTIFICATION, READ_NOTIFICATION } from "../../query/NotificationQuery"
import { Notification } from "../../model/NotificationModel"
import { CgProfile } from "react-icons/cg"
import { useNavigate } from "react-router-dom"
import { timeSinceLong } from "../../helper/DateHelper"
import { useState } from "react"
import { color } from "html2canvas/dist/types/css/types/color"
import { getCurrentUser } from "../component/MasterLayout"
import { ACCEPT_GROUP_INVITE, GET_USER, REJECT_GROUP_INVITE } from "../../query/UserQuery"
import { User } from "../../model/UserModel"
import { Group } from "../../model/GroupModel"

export default function NotificationsPage() {

    const user = getCurrentUser()
    const navigate = useNavigate()

    const { data, refetch: refetchNotification } = useQuery<{ getUserNotification: Notification[] }>(GET_USER_NOTIFICATION)
    const { data: userData, refetch: refetchUser } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: user?.id
        }
    })
    const [readNotification] = useMutation(READ_NOTIFICATION)
    const [activeButton, setActiveButton] = useState('all')

    const handleRead = async (notifID: string) => {
        await readNotification({
            variables: {
                notificationID: notifID
            }
        })
        refetchNotification()
    }

    const handleRefetch = () => {
        refetchUser()
    }

    const toProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }

    const toGroup = (groupID: string) => {
        navigate(`/main/groups/${groupID}}`)
    }

    return (
        <div className={style['page-container']}>
            <div className={style['content-container']}>
                <h2>Notifications</h2>
                <div className={style['button-container']}>
                    <button onClick={() => setActiveButton('all')} className={activeButton == 'all' ? style['btn-active'] : ''}>All</button>
                    <button onClick={() => setActiveButton('unread')} className={activeButton == 'unread' ? style['btn-active'] : ''}>Unread</button>
                </div>
                {
                    userData?.getUser.groupInvite.length ?
                        <div className={style['invite-container']}>
                            <h4  style={{color: 'var(--default-blue-text)'}}>Group Invite</h4>
                            {userData.getUser.groupInvite.map((data) => (
                                <GroupInviteCard key={data.id} data={data} toGroup={toGroup} handleRefetch={handleRefetch} />
                            ))}
                        </div>
                        : null
                }
                <h4>Earlier</h4>
                <div className={style['cards-container']}>

                    {data?.getUserNotification && activeButton == 'all' ?
                        data.getUserNotification.map((data) => (
                            <NotificationCard key={data.id} data={data} handleRead={handleRead} toProfile={toProfile} />
                        ))
                        : null
                    }
                    {data?.getUserNotification && activeButton == 'unread' ?
                        data.getUserNotification.filter(data => !data.read).map((data) => (
                            <NotificationCard key={data.id} data={data} handleRead={handleRead} toProfile={toProfile} />
                        ))
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

interface NotificationCardProps {
    data: Notification
    toProfile: (userID: string) => void
    handleRead: (notifID: string) => Promise<void>
}

function NotificationCard({ data, toProfile, handleRead }: NotificationCardProps) {

    return (
        <div className={style['card-container']} onClick={() => handleRead(data.id)}>
            {data.fromUser.profileImageURL ? <img src={data.fromUser?.profileImageURL} alt="" className={style['profile-icon']} onClick={() => toProfile(data.fromUser.id)} /> : <CgProfile className={style['profile-icon']} onClick={() => toProfile(data.fromUser.id)} />}

            <div className={style['card-detail']}>
                <h5 style={!data.read ? { color: 'black' } : { color: 'gray' }}>{data.text}</h5>
                <h6 style={!data.read ? { color: 'var(--default-blue-text)', fontWeight: 'bold' } : { color: 'gray' }}>{timeSinceLong(new Date(data.createdAt))}</h6>
            </div>
            {!data.read &&
                <div className={style['read-icon']}>
                </div>
            }
        </div>
    )
}

interface GroupInviteCardProps {
    data: Group
    toGroup: (groupID: string) => void
    handleRefetch: () => void

}

function GroupInviteCard({ data, toGroup, handleRefetch }: GroupInviteCardProps) {

    const [acceptInvite] = useMutation(ACCEPT_GROUP_INVITE, {
        variables: {
            groupID: data.id
        }
    })

    const [rejectInvite] = useMutation(REJECT_GROUP_INVITE, {
        variables: {
            groupID: data.id
        }
    })

    const handleAccept = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        await acceptInvite()
        handleRefetch()
    }

    const handleReject = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        await rejectInvite()
        handleRefetch()
    }

    return (
        <div className={style['card-container']} onClick={() => toGroup(data.id)}>
            {data.bannerImageURL ? <img src={data.bannerImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <h4>{data.name}</h4>
            <div className={style['button-container']}>
                <button id={style['accept-btn']} onClick={(e) => handleAccept(e)}>Accept</button>
                <button id={style['reject-btn']} onClick={(e) => handleReject(e)}>Reject</button>
            </div>
        </div>
    )
}