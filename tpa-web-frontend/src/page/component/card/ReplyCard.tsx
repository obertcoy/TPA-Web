import style from './css/ReplyCard.module.scss'
import { Comment } from "../../../model/PostModel"
import { CgProfile } from 'react-icons/cg'
import { useState } from 'react'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { timeSinceShort } from '../../../helper/DateHelper'
import { getCurrentUser } from '../MasterLayout'
import { CREATE_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT } from '../../../query/PostQuery'
import { useMutation } from '@apollo/client'
import { IoMdSend } from 'react-icons/io'
import { CREATE_REEL_COMMENT, LIKE_REEL_COMMENT, UNLIKE_REEL_COMMENT } from '../../../query/ReelQuery'
import { DisplayTextFromHTML } from '../../../helper/TextHelper'
import EditorText from '../EditorText'

interface ReplyCardProps {
    data: Comment
    postID: string | null
    reelID: string | null
    parentID: string | null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetch: (variables?: Partial<any>) => Promise<any>;
}

export default function ReplyCard({ data, postID, reelID, parentID, refetch }: ReplyCardProps) {

    const user = getCurrentUser()

    const [isLiked, setIsLiked] = useState(data.likedBy?.some(like => like.id === user?.id) || false)
    const [likeCount, setLikeCount] = useState(data.likedBy?.length || 0)
    const [likeReply] = useMutation(LIKE_COMMENT)
    const [unlikeReply] = useMutation(UNLIKE_COMMENT)
    const [createReply] = useMutation(CREATE_COMMENT)

    const [likeReelComment] = useMutation(LIKE_REEL_COMMENT)
    const [unlikeReelComment] = useMutation(UNLIKE_REEL_COMMENT)
    const [createReelReply] = useMutation(CREATE_REEL_COMMENT)

    const [replyText, setReplyText] = useState('')
    const [replyOpen, setReplyOpen] = useState(false)
    const [resetEditor, setResetEditor] = useState(false)

    const handleOpenCreateReply = () => {
        setReplyOpen(!replyOpen)
    }

    const handleCreateReply = async () => {
        if (replyText != '') {
            if (postID) {
                await createReply({
                    variables: {
                        inputComment: {
                            text: replyText,
                            parentID: parentID
                        },
                        postID: postID
                    }
                })
            } else if (reelID) {
                await createReelReply({
                    variables: {
                        inputReelComment: {
                            text: replyText,
                            parentID: parentID
                        },
                        reelID: reelID
                    }
                })
            }
            setReplyText('')
            setResetEditor(!resetEditor)
            refetch()
        }
    }


    const handleLike = async () => {

        if (postID) {

            if (!isLiked) {
                await likeReply({
                    variables: {
                        commentID: data?.id
                    }
                })
                setLikeCount(likeCount + 1)

            }
            else {
                await unlikeReply({
                    variables: {
                        commentID: data?.id
                    }
                })
                setLikeCount(likeCount - 1)

            }
        } else if (reelID) {
            if (!isLiked) {
                await likeReelComment({
                    variables: {
                        reelCommentID: data?.id
                    }
                })
                setLikeCount(likeCount + 1)

            }
            else {
                await unlikeReelComment({
                    variables: {
                        reelCommentID: data?.id
                    }
                })
                setLikeCount(likeCount - 1)
            }
        }

        setIsLiked(!isLiked)
    }

    return (
        <div className={style['card-container']}>
            <div className={style['card-body']}>
                {data.user?.profileImageURL ? <img src={data.user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                <div>
                    <h5>{data.user.first_name} {data.user.last_name}</h5>
                    <div dangerouslySetInnerHTML={{ __html: DisplayTextFromHTML(data?.text) }} />

                    <div>
                        <h6>{timeSinceShort(new Date(data?.createdAt))}</h6>
                        {likeCount > 0 ? (
                            <p>{likeCount} likes</p>
                        ) : (
                            null
                        )}
                        <p onClick={handleOpenCreateReply} className={style['reply-btn']}>Reply</p>
                    </div>
                </div>
                {isLiked ?
                    <AiFillHeart className={style['heart-icon-active']} onClick={handleLike} /> :
                    <AiOutlineHeart className={style['heart-icon']} onClick={handleLike} />
                }

            </div>
            <div className={style['reply-input-container']} style={replyOpen ? { display: 'flex' } : { display: 'none' }}>
                <div className={style['reply-input']}>
                    {data.user?.profileImageURL ? <img src={data.user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                    <div>
                        {/* <input type="text" onChange={(e) => setReplyText(e.target.value)} value={replyText} placeholder="Write a reply..." /> */}
                        <EditorText handleOnChange={setReplyText} placeholder={'Write a reply...'} resetEditor={resetEditor} />
                        <IoMdSend className={style['send-icon']} onClick={handleCreateReply} />
                    </div>
                </div>
            </div>

        </div >
    )
}