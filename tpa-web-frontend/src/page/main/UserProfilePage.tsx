import style from '../css/UserProfilePage.module.scss'
import { HiVideoCamera } from 'react-icons/hi'
import { BiSolidGridAlt, BiSolidMessageRounded, BiSolidSmile } from 'react-icons/bi'
import { IoMdPersonAdd, IoMdPhotos } from 'react-icons/io'
import { useState, useEffect, useRef } from 'react'
import { CgProfile } from 'react-icons/cg'
import CreatePostModal from '../component/modal/CreatePostModal'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_POST } from '../../query/PostQuery'
import PostCard from '../component/card/PostCard'
import { Post } from '../../model/PostModel'
import { getCurrentUser } from '../component/MasterLayout'
import PostModal from '../component/modal/PostModal'
import { useNavigate, useParams } from 'react-router-dom'
import { ACCEPT_FRIEND_REQUEST, GET_ALL_NON_FRIEND, GET_USER, SEND_FRIEND_REQUEST, UPDATE_BANNER_IMAGE, UPDATE_PROFILE_IMAGE } from '../../query/UserQuery'
import { ShowUser, User } from '../../model/UserModel'
import { AiOutlinePlus } from 'react-icons/ai'
import { BiSolidChevronDown } from 'react-icons/bi'
import { BsCameraFill, BsFillCalendarDateFill, BsFillPersonPlusFill, BsGenderFemale, BsGenderMale, BsList } from 'react-icons/bs'
import { firebaseStorage } from '../../provider/FirebaseProvider'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { IoIosSettings } from 'react-icons/io'
import { GET_USER_REEL } from '../../query/ReelQuery'
import HomeReelCard from '../component/card/HomeReelCard'
import { Reel } from '../../model/ReelModel'
import { MdOutlineMailOutline } from 'react-icons/md'
import { ChatRoom } from '../../model/ChatModel'
import { GO_TO_CHATROOM } from '../../query/ChatQuery'

export default function UserProfilePage() {

    const { userID } = useParams()
    const user = getCurrentUser()
    const [authorized, setAuthorized] = useState(false)
    const { loading, data: userPageData, refetch: refetchUser } = useQuery<{ getUser: User }>(GET_USER, {
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

    const [sendFriendRequest, { data: sendRequestData }] = useMutation(SEND_FRIEND_REQUEST, {
        variables: {
            friendID: userID
        }
    })

    const [acceptFriendRequest, { data: acceptRequestData }] = useMutation(ACCEPT_FRIEND_REQUEST, {
        variables: {
            friendID: userID
        }
    })

    const addFriend = async () => {
        await sendFriendRequest()
    }

    const acceptFriend = async () => {
        await acceptFriendRequest()
    }

    useEffect(() => {
        if (sendRequestData) {
            refetchUser()
            toast.success('Friend request sended')
        }
        if (acceptRequestData) {
            refetchUser()
            toast.success('Friend request accepted')
        }
    }, [sendRequestData, acceptRequestData])

    const editProfileInputRef = useRef<HTMLInputElement>(null)
    const handleEditProfileClick = () => {
        console.log('test');

        editProfileInputRef.current?.click();

    };
    const editBannerInputRef = useRef<HTMLInputElement>(null)
    const handleEditBannerClick = () => {
        editBannerInputRef.current?.click();
    };

    const [updateBannerImage] = useMutation(UPDATE_BANNER_IMAGE)
    const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMAGE)

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

    useEffect(() => {
        if (userID == user?.id) {
            setAuthorized(true)
        } else {
            setAuthorized(false)
        }
    }, [userID])

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

    const handleBannerImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {

            const file = files[0]
            const fileRef = ref(firebaseStorage, `profile/${v4()}${file.name}`);

            toast.promise(
                uploadBytes(fileRef, file),
                {
                    pending: 'Uploading banner...',
                    success: 'Banner updated!',
                    error: 'File upload failed',
                }
            ).then(async (snapshot) => {

                const url = await getDownloadURL(snapshot.ref);
                await updateBannerImage({
                    variables: {
                        fileURL: url
                    }
                })
                refetchUser()
            })

        }
    };


    const handleProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {

            const file = files[0]
            const fileRef = ref(firebaseStorage, `profile/${v4()}${file.name}`);

            toast.promise(
                uploadBytes(fileRef, file),
                {
                    pending: 'Uploading profile picture...',
                    success: 'Profile picture updated!',
                    error: 'File upload failed',
                }
            ).then(async (snapshot) => {

                const url = await getDownloadURL(snapshot.ref);
                await updateProfileImage({
                    variables: {
                        fileURL: url
                    }
                })
                refetchUser()
            })

        }
    };

    // Reels

    const toReelPage = (reelID: string) => {
        sessionStorage.setItem('startReelPage', reelID)
        navigate(`/main/reels/`)
    }

    console.log(user);
    
    return (
        <>
            {openCreatePost && <CreatePostModal handleOpenCreatePost={handleOpenCreatePost} refetchGetAllPost={refetchGetAllPost} />}
            {openPostModal && postModalID && <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} />}

            <div className={style['page-container']}>

                <div className={style['header-container']}>
                    <div className={style['profile-container']}>

                        <div className={style['banner-container']}>

                            {userPageData?.getUser.bannerImageURL ? <img src={userPageData?.getUser.bannerImageURL} alt="" className={style['banner']} /> : <div className={style['banner']} style={{ backgroundColor: "gray" }} ></div>}
                            {authorized && <div id={style['banner-btn']} onClick={handleEditBannerClick}><BsCameraFill className={style['btn-icon']} /> Edit cover photo</div>}
                            <input type="file" accept='image/*' ref={editBannerInputRef} onChange={handleBannerImage} style={{ display: 'none' }} />
                        </div>

                        <div className={style['profile']}>
                            {userPageData?.getUser.profileImageURL ? <img src={userPageData?.getUser.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                            <div onClick={handleEditProfileClick}>
                                {authorized && <BsCameraFill id={style['edit-profile-icon']} />}
                            </div>
                            <input type="file" accept='image/*' ref={editProfileInputRef} onChange={handleProfileImage} style={{ display: 'none' }} />

                            <div>
                                <h2>{userPageData?.getUser.first_name + " " + userPageData?.getUser.last_name}</h2>
                                <h5>{userPageData?.getUser.friend?.length || 0} friends</h5>
                            </div>
                            <div className={style['button-container']}>
                                {
                                    authorized &&
                                    <button id={style['story-btn']} onClick={() => navigate('/main/create-story/select')}><AiOutlinePlus className={style['btn-icon']} /> Add to story</button>
                                }
                                {
                                    (!user?.pendingFriend?.some(pending => pending.id == userID) &&
                                        !user?.friend?.some(friend => friend.id == userID) &&
                                        user?.id != userID) && 
                                        !userPageData?.getUser?.pendingFriend?.some(pending => pending.id == user?.id) &&
                                        (
                                        <button id={style['add-btn']} onClick={addFriend}>
                                            <BsFillPersonPlusFill className={style['btn-icon-white']} />Add Friend
                                        </button>)
                                }
                                {
                                    user?.pendingFriend?.some(pending => pending.id == userID) &&
                                    <button id={style['confirm-btn']} onClick={acceptFriend}>Confirm Request</button>
                                }
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
                                    {
                                        authorized &&
                                        <button className={style['post-setting']}><IoIosSettings id={style['setting-icon']} />Manage posts</button>
                                    }
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

                            <div className={style['create-post-container']}>
                                <div className={style['create-post-input']} >
                                    {userPageData?.getUser.profileImageURL ? <img src={userPageData?.getUser.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                                    <button onClick={handleOpenCreatePost}>What's on your mind, {userPageData?.getUser.first_name}?</button>
                                </div>
                                <hr />
                                <div className={style['create-post-decor']}>
                                    <div>
                                        <HiVideoCamera style={{ color: "red" }} />
                                        <p>Live Video</p>
                                    </div>
                                    <div>
                                        <IoMdPhotos style={{ color: "green" }} />
                                        <p>Photo/Video</p>
                                    </div>
                                    <div>
                                        <BiSolidSmile style={{ color: "yellow" }} />
                                        <p>Feeling/Activity</p>
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
                            {userPageData?.getUser?.friend.length ?
                                userPageData?.getUser?.friend.map((data: ShowUser) => (
                                    <FriendCard key={data.id} data={data} toUserProfile={toUserProfile} />
                                ))
                                : <h4 style={{ color: "gray" }}>No friends...</h4>
                            }
                        </div>
                    </div>
                }
            </div >
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

function NonFriendCard({ data, userPageData, toUserProfile }: NonFriendCardProps) {

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