import { Post } from '../../../model/PostModel'
import style from './css/PostCard.module.scss'
import { CgProfile } from 'react-icons/cg'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { GoComment } from 'react-icons/go'
import { PiShareFatLight } from 'react-icons/pi'
import { useMutation, useQuery } from '@apollo/client'
import { DELETE_POST, LIKE_POST, UNLIKE_POST } from '../../../query/PostQuery'
import { useState } from 'react'
import { timeSinceLong } from '../../../helper/DateHelper'
import { useNavigate } from 'react-router-dom'
import { DisplayTextFromHTML } from '../../../helper/TextHelper'
import { getCurrentUser } from '../MasterLayout'
import { CHECK_ADMIN_USER } from '../../../query/GroupQuery'
import { useEffect } from 'react'
import { SharePostModal } from '../modal/SharePostModal'

interface PostCardProps {

    data: Post
    liked: boolean
    handleOpenPostModal: (postID: string) => void
}

export default function PostCard({ data, liked, handleOpenPostModal }: PostCardProps) {

    const [likePost] = useMutation(LIKE_POST)
    const [unlikePost] = useMutation(UNLIKE_POST)
    const [deletePost] = useMutation(DELETE_POST)

    const [isLiked, setIsLiked] = useState(liked)
    const [likeCount, setLikeCount] = useState(data.likedBy?.length || 0)
    const [visible, setVisible] = useState(true)
    const [groupAdmin, setGroupAdmin] = useState(false)
    
    const [openShareModal, setOpenShareModal] = useState(false)

    const { data: checkAdmin } = useQuery<{ checkAdminUser: boolean }>(CHECK_ADMIN_USER, {
        skip: !data.group,
        variables: {
            groupID: data.group?.id
        }
    })

    const handleOpenShareModal = () => {
        
        setOpenShareModal(!openShareModal)
    }

    useEffect(() => {
        if (checkAdmin?.checkAdminUser) {
            setGroupAdmin(checkAdmin.checkAdminUser)
        }
    }, [checkAdmin])

    const handleLike = () => {

        if (!isLiked) {
            likePost({
                variables: {
                    postID: data.id
                }
            })
            if (likeCount) {
                setLikeCount(likeCount + 1)
            }
        }
        else {
            unlikePost({
                variables: {
                    postID: data.id
                }
            })
            if (likeCount) {
                setLikeCount(likeCount - 1)
            }
        }

        setIsLiked(!isLiked)
    }

    const navigate = useNavigate()

    const toUserProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }

    const handleDeletePost = async () => {
        await deletePost({
            variables: {
                postID: data.id
            }
        })
        setVisible(false)
    }

    const user = getCurrentUser()

    return (
        <>
        {openShareModal && <SharePostModal postID={data.id} handleOpenShareModal={handleOpenShareModal}/>}
            {
                visible &&
                <div className={style['card-container']}>
                    <div className={style['card-body']}>
                        <div className={style['card-body-profile']}>
                            {data.user?.profileImageURL ? <img src={data.user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                            <div>
                                {data.group != null ?
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <h5>{data.group.name}</h5>
                                        <h6>Posted by <b>{data.user?.first_name} {data.user?.last_name}</b>
                                            {data.tagged && data.tagged.length > 0 && (
                                                <>
                                                    <span style={{ fontWeight: '400' }}> with </span>
                                                    {data.tagged.map((user, index) => (
                                                        <b><span key={user.id} onClick={() => toUserProfile(user.id)} style={{ cursor: 'pointer' }}>
                                                            {index > 0 && ", "}
                                                            {user.first_name} {user.last_name}
                                                        </span></b>
                                                    ))}
                                                </>
                                            )}
                                        </h6>
                                    </div>
                                    :
                                    <h5>
                                        {data.user?.first_name} {data.user?.last_name}
                                        {data.tagged && data.tagged.length > 0 && (
                                            <>
                                                <span style={{ fontWeight: '400' }}> is with </span>
                                                {data.tagged.map((user, index) => (
                                                    <span key={user.id} onClick={() => toUserProfile(user.id)} style={{ cursor: 'pointer' }}>
                                                        {index > 0 && ", "}
                                                        {user.first_name} {user.last_name}
                                                    </span>
                                                ))}
                                            </>
                                        )}
                                    </h5>
                                }

                                <h6>{timeSinceLong(new Date(data.createdAt))}</h6>
                            </div>
                            {
                                (data.user.id == user?.id || groupAdmin) &&
                                <button id={style['delete-btn']} onClick={handleDeletePost}>Delete</button>
                            }
                        </div>
                        <div className={style['card-content-text']}>
                            <div dangerouslySetInnerHTML={{ __html: DisplayTextFromHTML(data.text) }} />
                        </div>
                        {data.fileURL &&
                            <div className={data.fileURL.length > 1 ? style['card-content-file-multi'] : style['card-content-file']}>
                                {data.fileURL.map((url, idx) => {
                                    if (url.includes('.mp4')) {
                                        return (
                                            <video key={url} src={url} className={data.fileURL &&
                                                data.fileURL?.length % 2 === 1 && idx === data.fileURL?.length - 1
                                                ? style['uploaded-file-long']
                                                : style['uploaded-file']
                                            }
                                                controls
                                            />
                                        )
                                    } else {
                                        return (
                                            <img key={url} src={url} className={data.fileURL &&
                                                data.fileURL?.length % 2 === 1 && idx === data.fileURL?.length - 1
                                                ? style['uploaded-file-long']
                                                : style['uploaded-file']
                                            } />
                                        )
                                    }
                                })}
                            </div>
                        }
                        <div className={style['card-stats']}>
                            <div>
                                <BiSolidLike />
                                {isLiked ? (
                                    <p>
                                        {likeCount > 1 ? "You and " + (likeCount - 1) + " others" : "You"}
                                    </p>
                                ) : (
                                    <p>{likeCount}</p>
                                )}
                            </div>
                            <div>
                                {data.comment &&
                                    <p>{data.comment?.length} comments</p>
                                }
                                {data.sharedBy &&
                                    <p>{data.sharedBy?.length} shares</p>
                                }
                            </div>
                        </div>
                        <div className={style['card-interact']}>
                            <div className={isLiked ? style['card-like-active'] : style['card-like']} onClick={handleLike}>
                                <BiLike className={style['interact-icon']} />
                                <p>Like</p>
                            </div>
                            <div className={style['card-comment']} onClick={() => handleOpenPostModal(data.id)}>
                                <GoComment className={style['interact-icon']} />
                                <p>Comment</p>
                            </div>
                            <div className={style['card-share']} onClick={handleOpenShareModal}>
                                <PiShareFatLight className={style['interact-icon']} />
                                <p>Share</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}