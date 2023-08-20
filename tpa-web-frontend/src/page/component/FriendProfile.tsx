import style from './css/FriendProfile.module.scss'
import { BiSolidGridAlt, BiSolidMessageRounded } from 'react-icons/bi'
import { IoMdPersonAdd } from 'react-icons/io'
import { useState, useEffect } from 'react'
import { CgProfile } from 'react-icons/cg'
import CreatePostModal from './modal/CreatePostModal'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_POST } from '../../query/PostQuery'
import PostCard from './card/PostCard'
import { Post } from '../../model/PostModel'
import { getCurrentUser } from './MasterLayout'
import PostModal from './modal/PostModal'
import { useNavigate } from 'react-router-dom'
import { GET_ALL_NON_FRIEND, GET_USER, SEND_FRIEND_REQUEST } from '../../query/UserQuery'
import { ShowUser, User } from '../../model/UserModel'
import { BiSolidChevronDown } from 'react-icons/bi'
import { BsFillCalendarDateFill, BsGenderFemale, BsGenderMale, BsList } from 'react-icons/bs'
import 'react-toastify/dist/ReactToastify.css';
import { GET_USER_REEL } from '../../query/ReelQuery'
import HomeReelCard from './card/HomeReelCard'
import { Reel } from '../../model/ReelModel'
import { MdFilterList, MdOutlineMailOutline } from 'react-icons/md'
import { ChatRoom } from '../../model/ChatModel'
import { GO_TO_CHATROOM } from '../../query/ChatQuery'

interface FriendProfileProps {
    userID: string
}

export default function FriendProfile({ userID }: FriendProfileProps) {

    const user = getCurrentUser()

    const { loading, data: userPageData } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: userID
        }
    })
    const { data: reelsData } = useQuery<{ getUserReel: Reel[] }>(GET_USER_REEL, {
        variables: {
            userID: userID
        }
    })
    const { data: nonFriendsData } = useQuery<{ getAllNonFriend: User[] }>(GET_ALL_NON_FRIEND, {
        variables: {
            id: userID
        }
    })

    const [goToChatRoom, { data: chatRoomData }] = useMutation<{ goToChatRoom: ChatRoom }>(GO_TO_CHATROOM, {
        variables: {
            inputChatRoom: {
                userID: [user?.id, userID]
            }
        }
    })

    const [activeHeader, setActiveHeader] = useState('posts')
    const [nonFriendOpen, setNonFriendOpen] = useState(false)
    const [postHeader, setPostHeader] = useState('list')
    const [postModalID, setPostModalID] = useState<string>('')
    const [openCreatePost, setOpenCreatePost] = useState(false)
    const [openPostModal, setOpenPostModal] = useState(false)

    const navigate = useNavigate()

    const toUserProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }

    const handleHeader = (header: string) => {
        setActiveHeader(header)
    }

    // Posts

    const handlePostHeader = (header: string) => {
        setPostHeader(header)
    }

    const handleOpenCreatePost = () => {
        setOpenCreatePost(!openCreatePost)
    }

    const handleOpenPostModal = (id: string) => {

        setOpenPostModal(true)
        setPostModalID(id)
    }

    const handleClosePostModal = () => {
        setOpenPostModal(false)
        setPostModalID('')
    }

    const handleMessage = async () => {
        await goToChatRoom()
    }

    useEffect(() => {
        if (chatRoomData) {
            navigate(`/main/chats/${chatRoomData.goToChatRoom.id}`)
        }
    }, [chatRoomData])

    const { data: postsData, refetch: refetchGetAllPost } = useQuery<{ getAllPost: Post[] }>(GET_ALL_POST)

    if (!postsData) {
        return <p>Loading...</p>
    }


    // Reels

    const toReelPage = (reelID: string) => {
        sessionStorage.setItem('startReelPage', reelID)
        navigate(`/main/reels/`)
    }

    return (
        <>
            {openCreatePost && <CreatePostModal handleOpenCreatePost={handleOpenCreatePost} refetchGetAllPost={refetchGetAllPost} initialGroup={null}/>}
            {openPostModal && postModalID && <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} />}

            <div className={style['page-container']}>

                <div className={style['header-container']}>
                    <div className={style['profile-container']}>

                        <div className={style['banner-container']}>

                            {userPageData?.getUser.bannerImageURL ? <img src={userPageData?.getUser.bannerImageURL} alt="" className={style['banner']} /> : <div className={style['banner']} style={{ backgroundColor: "gray" }} ></div>}
                        </div>

                        <div className={style['profile']}>
                            {userPageData?.getUser.profileImageURL ? <img src={userPageData?.getUser.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}

                            <div>
                                <h2>{userPageData?.getUser.first_name + " " + userPageData?.getUser.last_name}</h2>
                                <h5>{userPageData?.getUser.friend?.length || 0} friends</h5>
                            </div>
                            <div className={style['button-container']}>
                                <button id={style['chat-btn']} onClick={handleMessage}><BiSolidMessageRounded className={style['btn-icon']} />Message</button>
                                <button id={style['know-btn']} onClick={() => setNonFriendOpen(!nonFriendOpen)}><BiSolidChevronDown className={style['btn-icon']} /></button>
                            </div>
                        </div>
                        <div className={style['non-friend-container']} style={nonFriendOpen ? { display: "flex" } : { display: "none" }}>
                            <h4>People you may know</h4>
                            <div className={style['non-friend-card-container']}>
                                {nonFriendsData?.getAllNonFriend.map((data: User) => (
                                    <NonFriendCard key={data.id} data={data} userPageData={userPageData?.getUser} toUserProfile={toUserProfile} />
                                ))}
                            </div>
                        </div>
                        <hr />
                        <div className={style['header-title-container']}>
                            <div className={activeHeader == 'posts' ? style['header-title-active'] : ''} onClick={() => handleHeader('posts')}>
                                <h5>Posts</h5>
                            </div>
                            <div className={activeHeader == 'reels' ? style['header-title-active'] : ''} onClick={() => handleHeader('reels')}>
                                <h5>Reels</h5>
                            </div>
                            <div className={activeHeader == 'friends' ? style['header-title-active'] : ''} onClick={() => handleHeader('friends')}>
                                <h5>Friends</h5>
                            </div>
                        </div>
                    </div>
                </div>

                {activeHeader == 'posts' &&

                    <div className={style['container']}>

                        <div className={style['side-container']}>
                            <div className={style['intro-container']}>

                                <h3>Intro</h3>
                                <hr />
                                <div className={style['intro-content']}>
                                    <p><MdOutlineMailOutline className={style['intro-icon']} />{userPageData?.getUser.email}</p>
                                    {
                                        userPageData?.getUser.gender == 'Male' ?
                                            <p><BsGenderMale className={style['intro-icon']} />{userPageData?.getUser.gender}</p>
                                            : <p><BsGenderFemale className={style['intro-icon']} />{userPageData?.getUser.gender}</p>

                                    }
                                    <p><BsFillCalendarDateFill className={style['intro-icon']} />{new Date(userPageData?.getUser.dob || '').toDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className={style['posts-container']}>



                            <div className={style['post-header']}>
                                <div className={style['post-header-title']}>
                                    <h3>Posts</h3>
                                    <button className={style['post-filter']}><MdFilterList id={style['filter-icon']} />Filter</button>
                                </div>
                                <hr />
                                <div className={style['post-header-view']}>
                                    <div className={postHeader == 'list' ? style['header-post-active'] : ''} onClick={() => handlePostHeader('list')}>
                                        <BsList />
                                        <h5>List View</h5>
                                    </div>
                                    <div className={postHeader == 'grid' ? style['header-post-active'] : ''} onClick={() => handlePostHeader('grid')}>
                                        <BiSolidGridAlt />
                                        <h5>Grid View</h5>
                                    </div>
                                </div>
                            </div>

                            <div className={postHeader == 'list' ? style['post-card-container-list'] : style['post-card-container-grid']}>

                                {
                                    loading ?
                                        <div>
                                            <p>Loading...</p>
                                        </div>
                                        : postsData.getAllPost?.filter(data => data.user.id == userPageData?.getUser.id).map((data: Post) => (
                                            <PostCard
                                                key={data.id}
                                                data={data}
                                                liked={data.likedBy?.some(like => like.id === userPageData?.getUser.id) || false}
                                                handleOpenPostModal={handleOpenPostModal}
                                            />
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                }
                {
                    activeHeader == 'reels' &&
                    <div className={style['reels-container']}>
                        <h3>{userPageData?.getUser.first_name} {userPageData?.getUser.last_name}'s Reels</h3>
                        <hr />
                        <div className={style['reel-card-container']}>
                            {reelsData?.getUserReel.length ?
                                reelsData.getUserReel.filter(data => data.user.id == userPageData?.getUser.id).map((data: Reel) => (
                                    <HomeReelCard key={data.id} data={data} toReelPage={toReelPage} />
                                ))
                                : <h4 style={{ color: "gray" }}>No reels...</h4>
                            }
                        </div>
                    </div>
                }
                {
                    activeHeader == 'friends' &&
                    <div className={style['friends-container']}>
                        <h3>{userPageData?.getUser.first_name} {userPageData?.getUser.last_name}'s Friends</h3>
                        <hr />
                        <div className={style['friend-card-container']}>
                            {userPageData?.getUser?.friend ?
                                userPageData?.getUser?.friend.map((data: ShowUser) => (
                                    <FriendCard key={data.id} data={data} toUserProfile={toUserProfile} />
                                ))
                                : <h4 style={{ color: "gray" }}>No friends...</h4>
                            }
                        </div>
                    </div>
                }
            </div >
        </>
    )
}

interface FriendCardProps {
    data: ShowUser
    toUserProfile: (userID: string) => void
}

function FriendCard({ data, toUserProfile }: FriendCardProps) {

    return (
        <div className={style['friend-card']} onClick={() => toUserProfile(data.id)} >
            {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div>
                <h5>{data.first_name + " " + data.last_name}</h5>
                <h6>mutuals</h6>
            </div>
        </div>
    )

}

interface NonFriendCardProps {
    data: User
    userPageData: User | undefined
    toUserProfile: (userID: string) => void
}

export function NonFriendCard({ data, userPageData, toUserProfile }: NonFriendCardProps) {

    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
        variables: {
            friendID: data.id
        }
    })

    const [isAdd, setIsAdd] = useState(data.pendingFriend.some(user => user.id === userPageData?.id))

    const handleSendFriendRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        await sendFriendRequest()
        setIsAdd(true)
    }

    return (
        <div className={style['non-friend-card']} onClick={() => toUserProfile(data.id)} >
            {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div>
                <h5>{data.first_name + " " + data.last_name}</h5>
                <h6>mutuals</h6>
                {isAdd ?
                    <button className={style['pending-btn']}>Pending...</button>
                    :
                    <button className={style['add-friend-btn']} onClick={(e) => handleSendFriendRequest(e)}><IoMdPersonAdd id={style['add-friend-icon']} />Add Friend</button>
                }
            </div>

        </div>
    )
}