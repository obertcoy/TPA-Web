import style from './css/PostModal.module.scss'
import { CgProfile } from 'react-icons/cg'
import { GrClose } from 'react-icons/gr'
import 'firebase/storage'
import { getCurrentUser } from '../MasterLayout'
import { Post } from '../../../model/PostModel'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { GoComment } from 'react-icons/go'
import { PiShareFatLight } from 'react-icons/pi'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_COMMENT, GET_POST, LIKE_POST, UNLIKE_POST } from '../../../query/PostQuery'
import { useState, useEffect } from 'react'
import { IoMdSend } from 'react-icons/io'
import CommentCard from '../card/CommentCard'
import { timeSinceLong } from '../../../helper/DateHelper'
import { useNavigate } from 'react-router-dom'
import { DisplayTextFromHTML } from '../../../helper/TextHelper'


interface PostModalProps {

    postID: string
    handleClosePostModal: () => void
}

export default function PostModal({ postID, handleClosePostModal }: PostModalProps) {

    const user = getCurrentUser()

    const { data, loading, refetch: refetchPost } = useQuery<{ getPost: Post }>(GET_POST, {
        variables: {
            id: postID
        },
        fetchPolicy: "network-only"

    })

    const [likePost] = useMutation(LIKE_POST)
    const [unlikePost] = useMutation(UNLIKE_POST)
    const [createComment] = useMutation(CREATE_COMMENT)

    const [isLiked, setIsLiked] = useState(data?.getPost?.likedBy?.some(like => like.id === user?.id) || false)
    const [likeCount, setLikeCount] = useState(0)
    const [commentText, setCommentText] = useState('')

    useEffect(() => {
        if (data?.getPost?.likedBy) {
            setLikeCount(data.getPost.likedBy.length);
        }
    }, [data]);

    const handleLike = async () => {

        if (!isLiked) {
            await likePost({
                variables: {
                    postID: data?.getPost?.id
                }
            })
            if (likeCount) {
                setLikeCount(likeCount + 1)
            }
        }
        else {
            await unlikePost({
                variables: {
                    postID: data?.getPost?.id
                }
            })
            if (likeCount) {
                setLikeCount(likeCount - 1)
            }
        }

        setIsLiked(!isLiked)
    }

    const handleCreateComment = async () => {
        if (commentText != '') {
            await createComment({
                variables: {
                    inputComment: {
                        text: commentText
                    },
                    postID: postID
                },
                refetchQueries: [{ query: GET_POST, variables: { id: postID } }]
            })
            setCommentText('')
        }
    }

    const navigate = useNavigate()

    const toUserProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }



    return (
        <div className={style['page-container']}>
            <div className={style['form-container']}>
                <div className={style['form-title']}>
                    <h4>{data?.getPost?.user?.first_name} {data?.getPost?.user?.last_name}'s Post</h4>
                    <GrClose className={style['close-icon']} onClick={handleClosePostModal} />
                </div>
                <hr />
                <div className={style['form-body']}>
                    <div className={style['card-container']}>
                        <div className={style['card-body']}>
                            <div className={style['card-body-profile']}>
                                {data?.getPost.user?.profileImageURL ? <img src={data?.getPost.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                                <div>
                                    <h5>
                                        {data?.getPost.user.first_name} {data?.getPost.user.last_name}
                                        {data?.getPost.tagged && data?.getPost.tagged.length > 0 && (
                                            <>
                                                <span style={{ fontWeight: '400' }}> is with </span>
                                                {data?.getPost.tagged.map((user, index) => (
                                                    <span key={user.id} onClick={() => toUserProfile(user.id)} style={{ cursor: 'pointer' }}>
                                                        {index > 0 && ", "}
                                                        {user.first_name} {user.last_name}
                                                    </span>
                                                ))}
                                            </>
                                        )}
                                    </h5>
                                    <h6>{timeSinceLong(new Date(data?.getPost?.createdAt || ""))}</h6>
                                </div>
                            </div>
                            <div className={style['card-content-text']}>
                                <div dangerouslySetInnerHTML={{ __html: DisplayTextFromHTML(data?.getPost.text)}} />
                            </div>
                            {data?.getPost?.fileURL &&
                                <div className={data.getPost.fileURL.length > 1 ? style['card-content-file-multi'] : style['card-content-file']}>
                                    {data.getPost?.fileURL.map((url, idx) => {
                                        if (url.includes('.mp4')) {
                                            return (
                                                <video key={url} src={url} className={data.getPost?.fileURL &&
                                                    data.getPost?.fileURL?.length % 2 === 1 && idx === data.getPost?.fileURL?.length - 1
                                                    ? style['uploaded-file-long']
                                                    : style['uploaded-file']
                                                }
                                                    controls
                                                />
                                            )
                                        } else {
                                            return (
                                                <img key={url} src={url} className={data.getPost?.fileURL &&
                                                    data.getPost?.fileURL?.length % 2 === 1 && idx === data.getPost?.fileURL?.length - 1
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
                                    {data?.getPost?.comment &&
                                        <p>{data.getPost?.comment?.length} comments</p>
                                    }
                                    {data?.getPost?.sharedBy &&
                                        <p>{data.getPost?.sharedBy?.length} shares</p>
                                    }
                                </div>
                            </div>
                            <div className={style['card-interact']}>
                                <div className={isLiked ? style['card-like-active'] : style['card-like']} onClick={handleLike}>
                                    <BiLike className={style['interact-icon']} />
                                    <p>Like</p>
                                </div>
                                <div className={style['card-comment']}>
                                    <GoComment className={style['interact-icon']} />
                                    <p>Comment</p>
                                </div>
                                <div className={style['card-share']}>
                                    <PiShareFatLight className={style['interact-icon']} />
                                    <p>Share</p>
                                </div>
                            </div>
                            {data?.getPost.comment && data?.getPost.comment.length > 0 && (
                                <div className={style['comment-container']}>
                                    {data.getPost.comment.filter(commentData => commentData.parentID == null).map((commentData) => (
                                        <CommentCard key={commentData.id} data={commentData} postID={data?.getPost?.id} reelID={null} refetch={refetchPost} />
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                <div className={style['comment-input-container']}>
                    <div className={style['comment-input']}>
                        {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                        <div>
                            <input type="text" onChange={(e) => setCommentText(e.target.value)} value={commentText} placeholder="Write a comment..." />
                            {/* <EditorText handleOnChange={setCommentText} placeholder={'Write a comment...'}/> */}
                            <IoMdSend className={style['send-icon']} onClick={handleCreateComment} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}