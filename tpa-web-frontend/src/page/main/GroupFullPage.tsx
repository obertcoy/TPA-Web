import style from '../css/GroupFullPage.module.scss'
import { BiChevronDown, BiChevronUp, BiPlus, BiSolidDoorOpen, BiSolidMessageRounded, BiSolidSmile } from 'react-icons/bi'
import { useState, useEffect, useRef } from 'react'
import { CgProfile } from 'react-icons/cg'
import { useMutation, useQuery } from '@apollo/client'
import { Post } from '../../model/PostModel'
import { useNavigate, useParams } from 'react-router-dom'
import { BiSolidChevronDown } from 'react-icons/bi'
import 'react-toastify/dist/ReactToastify.css';
import { ChatRoom } from '../../model/ChatModel'
import { Group, GroupFile, GroupUser } from '../../model/GroupModel'
import { HiVideoCamera } from 'react-icons/hi'
import { IoMdPhotos } from 'react-icons/io'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from '../../provider/FirebaseProvider'
import { v4 } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { BsCameraFill } from 'react-icons/bs'
import { AiFillDelete, AiOutlineDownload, AiOutlineSearch } from 'react-icons/ai'
import { UserName } from '../../helper/UserHelper'
import CreatePostModal from '../component/modal/CreatePostModal'
import PostModal from '../component/modal/PostModal'
import { InviteGroupModal } from '../component/modal/InviteGroupModal'
import PostCard from '../component/card/PostCard'
import { ShowUser, User } from '../../model/UserModel'
import { getCurrentUser } from '../component/MasterLayout'
import { APPROVE_REQUEST, CHECK_ADMIN_USER, CHECK_INVITE, CHECK_MEMBER, DELETE_GROUP_FILE, EDIT_GROUP_BANNER, GET_ALL_GROUP_FILE, GET_ALL_GROUP_USER, GET_GROUP, KICK_MEMBER, LEAVE_GROUP, PROMOTE_MEMBER, REJECT_REQUEST, REQUEST_JOIN_GROUP, UPLOAD_GROUP_FILE } from '../../query/GroupQuery'
import { GO_TO_CHATROOM } from '../../query/ChatQuery'
import { GET_GROUP_POST } from '../../query/PostQuery'
import { ACCEPT_GROUP_INVITE } from '../../query/UserQuery'


export default function GroupFullPage() {

    const { groupID } = useParams() || ''

    console.log(groupID);

    const user = getCurrentUser()
    const [authorized, setAuthorized] = useState(false)
    const [isMember, setIsMember] = useState(false)
    const [isInvited, setIsInvited] = useState(false)

    const { data: checkMember, refetch: refetchCheckMember } = useQuery<{ checkMember: boolean }>(CHECK_MEMBER, {
        variables: {
            groupID: groupID
        }
    })

    const { data: checkInvite } = useQuery<{ checkInvite: boolean }>(CHECK_INVITE, {
        variables: {
            groupID: groupID
        }
    })

    const { loading, data: groupPageData, refetch: refetchGroup } = useQuery<{ getGroup: Group }>(GET_GROUP, {
        variables: {
            groupID: groupID
        }
    })

    const [goToChatRoom, { data: chatRoomData }] = useMutation<{ goToChatRoom: ChatRoom }>(GO_TO_CHATROOM, {
        variables: {
            inputChatRoom: {
                userID: [user?.id],
                groupID: groupID
            }
        }
    })

    const [leaveGroup] = useMutation(LEAVE_GROUP, {
        variables: {
            groupID: groupID
        }
    })

    const { data: checkAdmin } = useQuery<{ checkAdminUser: boolean }>(CHECK_ADMIN_USER, {
        variables: {
            groupID: groupID
        }
    })

    const { data: groupUserData, refetch: refetchGroupUser } = useQuery<{ getAllGroupUser: GroupUser[] }>(GET_ALL_GROUP_USER, {
        variables: {
            groupID: groupID
        }
    })

    const { data: postsData, refetch: refetchGetAllPost } = useQuery<{ getGroupPost: Post[] }>(GET_GROUP_POST, {
        variables: {
            groupID: groupID
        }
    })

    const { data: filesData, refetch: refetchFiles } = useQuery<{ getAllGroupFile: GroupFile[] }>(GET_ALL_GROUP_FILE, {
        variables: {
            groupID: groupID
        }
    })

    const [activeHeader, setActiveHeader] = useState('discussion')
    const [nonFriendOpen, setNonFriendOpen] = useState(false)
    const [postModalID, setPostModalID] = useState<string>('')
    const [openCreatePost, setOpenCreatePost] = useState(false)
    const [openPostModal, setOpenPostModal] = useState(false)
    const [openInviteModal, setOpenInviteOpenModal] = useState(false)

    const [searchFile, setSearchFile] = useState('')

    useEffect(() => {
        if (chatRoomData) {
            navigate(`/main/chats/${chatRoomData.goToChatRoom.id}`)
        }
    }, [chatRoomData])

    useEffect(() => {
        setAuthorized(checkAdmin?.checkAdminUser || false)
    }, [checkAdmin])

    useEffect(() => {
        setIsMember(checkMember?.checkMember || false)
    }, [checkMember])

    useEffect(() => {
        setIsInvited(checkInvite?.checkInvite || false)
    }, [checkInvite])

    const navigate = useNavigate()

    const toUserProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }

    const handleHeader = (header: string) => {
        setActiveHeader(header)
    }

    const handleRefetchGroup = () => {
        refetchGroup()
    }

    const handleRefetchGroupUser = () => [
        refetchGroupUser()
    ]

    const editBannerInputRef = useRef<HTMLInputElement>(null)
    const handleEditBannerClick = () => {
        editBannerInputRef.current?.click();
    };

    const [editGroupBanner] = useMutation(EDIT_GROUP_BANNER)

    const [requestJoinGroup] = useMutation(REQUEST_JOIN_GROUP, {
        variables: {
            groupID: groupID
        }
    })

    const [acceptInvite] = useMutation(ACCEPT_GROUP_INVITE, {
        variables: {
            groupID: groupID
        }
    })

    const handleRequest = async () => {
        await requestJoinGroup()
        refetchCheckMember()
        toast.success("Request sent")
    }

    const handleAccept = async () => {
        await acceptInvite()
        refetchCheckMember()
        toast.success("Invite accepted")
    }


    // Posts

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

    const handleOpenInviteModal = () => {
        setOpenInviteOpenModal(!openInviteModal)
    }

    const handleLeave = async () => {
        await leaveGroup()
        navigate('/main/groups/')
    }

    const handleMessage = async () => {
        await goToChatRoom()
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
                await editGroupBanner({
                    variables: {
                        groupID: groupID,
                        fileURL: url
                    }
                })
                refetchGroup()
            })

        }
    };

    // MEMBERS 


    // FILES

    const [sortOrder, setSortOrder] = useState('desc');
    const [uploadGroupFile] = useMutation(UPLOAD_GROUP_FILE)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredFiles = filesData?.getAllGroupFile
        .filter(files =>
            (files.fileName).toLowerCase().includes(searchFile.toLowerCase())
        )
        .slice()
        .sort((a, b) => {
            const aValue = new Date(a.createdAt).getTime()
            const bValue = new Date(b.createdAt).getTime()

            if (sortOrder === 'asc') {
                return aValue - bValue
            } else {
                return bValue - aValue
            }
        }) || []

    const handleSort = () => {
        setSortOrder(sortOrder == 'asc' ? 'desc' : 'asc');
    };

    const handleInputFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {

            const file = files[0]
            let fileName = file.name
            let fileRef = ref(firebaseStorage, `group/${groupPageData?.getGroup.name}/${fileName}`);

            let counter = 1;

            while (await getDownloadURL(fileRef).catch(() => null)) {
                const extensionIndex = fileName.lastIndexOf('.');
                const baseName = extensionIndex !== -1 ? fileName.slice(0, extensionIndex) : fileName;
                const extension = extensionIndex !== -1 ? fileName.slice(extensionIndex) : '';
                fileName = `${baseName} (${counter})${extension}`;

                fileRef = ref(firebaseStorage, `group/${groupPageData?.getGroup.name}/${fileName}`);
                counter++;
            }

            toast.promise(
                uploadBytes(fileRef, file),
                {
                    pending: 'Uploading file...',
                    success: 'File uploaded!',
                    error: 'File upload failed',
                }
            ).then(async (snapshot) => {

                const url = await getDownloadURL(snapshot.ref);
                await uploadGroupFile({
                    variables: {
                        inputGroupFile: {
                            groupID: groupID,
                            fileURL: url,
                            fileName: fileName,
                            type: file.type
                        }
                    }
                })
                refetchFiles()
            })

        }
    }

    const [deleteFile] = useMutation(DELETE_GROUP_FILE)

    const handleDeleteFile = async (fileID: string) => {
        await deleteFile({
            variables: {
                groupID: groupID,
                fileID: fileID
            }
        })
        toast.success('File deleted')
        refetchFiles()
    }

    if (!postsData) {
        return <p>Loading...</p>
    }

    return (
        <>
            {openCreatePost && <CreatePostModal handleOpenCreatePost={handleOpenCreatePost} refetchGetAllPost={refetchGetAllPost} initialGroup={groupPageData?.getGroup as Group} />}
            {openPostModal && postModalID && <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} />}
            {openInviteModal && <InviteGroupModal groupID={groupID || ''} handleOpenInviteModal={handleOpenInviteModal} />}
            <div className={style['page-container']}>

                <div className={style['header-container']}>
                    <div className={style['profile-container']}>

                        <div className={style['banner-container']}>

                            {groupPageData?.getGroup.bannerImageURL ? <img src={groupPageData?.getGroup.bannerImageURL} alt="" className={style['banner']} /> : <div className={style['banner']} style={{ backgroundColor: "gray" }} ></div>}
                            {authorized && <div id={style['banner-btn']} onClick={handleEditBannerClick}><BsCameraFill className={style['btn-icon']} /> Edit cover photo</div>}
                            <input type="file" accept='image/*' ref={editBannerInputRef} onChange={handleBannerImage} style={{ display: 'none' }} />
                        </div>

                        <div className={style['profile']}>

                            <h2>{groupPageData?.getGroup.name}</h2>
                            <div className={style['button-container']}>
                                {isMember ?
                                    <>
                                        <button id={style['invite-btn']} onClick={handleOpenInviteModal}><BiPlus className={style['btn-icon']} />Invite</button>
                                        <button id={style['chat-btn']} onClick={handleMessage}><BiSolidMessageRounded className={style['btn-icon']} />Message</button>
                                        <button id={style['leave-btn']} onClick={handleLeave}><BiSolidDoorOpen />Leave</button>
                                    </>
                                    :
                                    (isInvited ?
                                        < button id={style['join-btn']} onClick={handleAccept}>Accept Invite</button>
                                        :
                                        < button id={style['join-btn']} onClick={handleRequest}>Request Join</button>
                                    )
                                }
                                <button id={style['know-btn']} onClick={() => setNonFriendOpen(!nonFriendOpen)}><BiSolidChevronDown className={style['btn-icon']} /></button>
                            </div>
                        </div>
                        <div className={style['non-friend-container']} style={nonFriendOpen ? { display: "flex" } : { display: "none" }}>
                            <h4>Related Groups</h4>
                        </div>
                        <hr />
                        <div className={style['header-title-container']}>
                            <div className={activeHeader == 'discussion' ? style['header-title-active'] : ''} onClick={() => handleHeader('discussion')}>
                                <h5>Discussion</h5>
                            </div>
                            {isMember &&
                                <>
                                    <div className={activeHeader == 'members' ? style['header-title-active'] : ''} onClick={() => handleHeader('members')}>
                                        <h5>Members</h5>
                                    </div>
                                    <div className={activeHeader == 'files' ? style['header-title-active'] : ''} onClick={() => handleHeader('files')}>
                                        <h5>Files</h5>
                                    </div>
                                    {
                                        authorized &&
                                        <div className={activeHeader == 'requests' ? style['header-title-active'] : ''} onClick={() => handleHeader('requests')}>
                                            <h5>Requests</h5>
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>

                {activeHeader == 'discussion' &&

                    <div className={style['container']}>

                        <div className={style['posts-container']}>

                            {isMember &&
                                <div className={style['create-post-container']}>
                                    <div className={style['create-post-input']} >
                                        {user?.profileImageURL ? <img src={user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                                        <button onClick={handleOpenCreatePost}>Write something...</button>
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
                                    <hr />

                                </div>

                            }
                            {
                                loading ?
                                    <div>
                                        <p>Loading...</p>
                                    </div>
                                    : postsData.getGroupPost?.map((data: Post) => (
                                        <PostCard
                                            key={data.id}
                                            data={data}
                                            liked={data.likedBy?.some(like => like.id === user?.id) || false}
                                            handleOpenPostModal={handleOpenPostModal}
                                        />
                                    ))
                            }
                        </div>

                        <div className={style['side-container']}>
                            <div className={style['about-container']}>

                                <h3>About</h3>
                                <hr />
                                <div className={style['about-content']}>

                                </div>
                            </div>
                        </div>

                    </div>
                }
                {
                    activeHeader == 'members' &&
                    <div className={style['members-container']}>
                        <h3>{groupPageData?.getGroup.name}'s Members</h3>
                        <hr />
                        <div className={style['member-card-container']}>
                            {groupUserData?.getAllGroupUser ?
                                groupUserData?.getAllGroupUser.map((data: GroupUser) => (
                                    <MemberCard key={data.user.id} data={data} toUserProfile={toUserProfile} authorized={authorized} user={user as User} groupID={groupID || ''} handleRefetchGroupUser={handleRefetchGroupUser} />
                                ))
                                : <h4 style={{ color: "gray" }}>No members...</h4>
                            }
                        </div>
                    </div>
                }
                {
                    activeHeader == 'files' &&
                    <div className={style['files-container']}>
                        <div className={style['file-header']}>
                            <h3>Files</h3>
                            <div className={style['header-subcontainer']}>
                                <div className={style['invite-search']}>
                                    <AiOutlineSearch id={style['search-icon']} />
                                    <input type="text" placeholder='Search Files' value={searchFile} onChange={(e) => setSearchFile(e.target.value)} />
                                </div>
                                <button onClick={handleInputFileClick}>Upload File</button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                            </div>
                        </div>
                        <hr />
                        <div className={style['file-card-container']}>
                            <div className={style['header-subcontainer']}>
                                <div className={style['card-header-name']}><h5>File Name</h5></div>
                                <div className={style['card-header-type']}><h5>Type</h5></div>
                                {sortOrder == 'desc' ?
                                    <div className={style['card-header-date']} onClick={handleSort}><h5>Last Modified <BiChevronDown cl /></h5></div>
                                    :
                                    <div className={style['card-header-date']} onClick={handleSort}><h5>Last Modified <BiChevronUp /></h5></div>
                                }
                            </div>

                            {filesData?.getAllGroupFile.length ?
                                filteredFiles.map((data) => (
                                    <FileCard data={data} handleDeleteFile={handleDeleteFile} authorized={authorized} />
                                ))
                                :
                                null
                            }
                        </div>

                    </div>
                }
                {
                    activeHeader == 'requests' &&
                    <div className={style['pending-members-container']}>
                        <h3>{groupPageData?.getGroup.name}'s Requests</h3>
                        <hr />
                        <div className={style['pending-member-card-container']}>
                            {groupPageData?.getGroup.pendingUser.length ?
                                groupPageData?.getGroup.pendingUser.map((data: ShowUser) => (
                                    <PendingMemberCard key={data.id} data={data} toUserProfile={toUserProfile} groupID={groupID || ''} handleRefetchGroup={handleRefetchGroup} />
                                ))
                                : <h4 style={{ color: "gray" }}>No requests...</h4>
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

interface MemberCardProps {
    data: GroupUser
    toUserProfile: (userID: string) => void
    authorized: boolean
    user: User
    groupID: string
    handleRefetchGroupUser: () => void
}

function MemberCard({ data, toUserProfile, authorized, user, groupID, handleRefetchGroupUser }: MemberCardProps) {

    const [promoteMember] = useMutation(PROMOTE_MEMBER)
    const [kickMember] = useMutation(KICK_MEMBER)

    const handlePromote = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        await promoteMember({
            variables: {
                groupID: groupID,
                userID: data.user.id
            }
        })
        handleRefetchGroupUser()
    }

    const handleKick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        await kickMember({
            variables: {
                groupID: groupID,
                userID: data.user.id
            }
        })
        handleRefetchGroupUser()
    }

    return (
        <>
            < div className={style['member-card']} onClick={() => toUserProfile(data.user.id)
            } >
                {data.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                < div >
                    <h5>{data.user.first_name + " " + data.user.last_name}</h5>
                    <h6>{data.role}</h6>
                </div >
                {authorized && data.user.id != user?.id &&
                    <div className={style['button-container']}>
                        {
                            data.role == 'Member' ?
                                <button id={style['promote-btn']} onClick={(e) => handlePromote(e)}>Promote</button>
                                :
                                null
                        }

                        <button id={style['kick-btn']} onClick={(e) => handleKick(e)}>Kick</button>

                    </div>
                }
            </div >
        </>
    )

}

interface FileCardProps {
    data: GroupFile
    handleDeleteFile: (fileID: string) => Promise<void>
    authorized: boolean
}

function FileCard({ data, handleDeleteFile, authorized }: FileCardProps) {

    const handleDownload = () => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = () => {
            const blob = xhr.response
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = data.fileName;
            link.click();

            window.URL.revokeObjectURL(link.href);
        }
        xhr.open('GET', data.fileURL)
        xhr.send()
    }


    return (
        <div className={style['file-card-container']}>
            <div className={style['card-name']}>
                <h5>
                    {data.fileName}
                </h5>
            </div>
            <div className={style['card-type']}>
                <h5>
                    {data.type}
                </h5>
            </div>
            <div className={style['card-date']}>
                <h5>
                    {new Date(data.createdAt).toLocaleString()}
                </h5>
                <h6>
                    by {UserName(data.user)}
                </h6>
            </div>
            <div className={style['card-download']} onClick={handleDownload}>
                <AiOutlineDownload id={style['download-icon']} />
            </div>
            {authorized &&
                < div className={style['card-delete']} onClick={() => handleDeleteFile(data.id)}>
                    <AiFillDelete id={style['delete-icon']} />
                </div>
            }
        </div >
    )
}


interface PendingMemberCardProps {
    data: ShowUser
    toUserProfile: (userID: string) => void
    groupID: string
    handleRefetchGroup: () => void
}

function PendingMemberCard({ data, toUserProfile, groupID, handleRefetchGroup }: PendingMemberCardProps) {

    const [approveRequest] = useMutation(APPROVE_REQUEST, {
        variables: {
            groupID: groupID,
            userID: data.id
        }
    })
    const [rejectRequest] = useMutation(REJECT_REQUEST, {
        variables: {
            groupID: groupID,
            userID: data.id
        }
    })

    const handleApprove = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        await approveRequest()
        handleRefetchGroup()
    }

    const handleReject = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        await rejectRequest()
        handleRefetchGroup()
    }

    return (
        <div className={style['pending-member-card']} onClick={() => toUserProfile(data.id)} >
            {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <h5>{data.first_name + " " + data.last_name}</h5>
            <div className={style['button-container']}>
                <button id={style['accept-btn']} onClick={handleApprove}>Accept</button>
                <button id={style['reject-btn']} onClick={handleReject}>Reject</button>
            </div>
        </div>
    )
}
