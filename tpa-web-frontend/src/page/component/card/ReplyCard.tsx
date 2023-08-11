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

interface ReplyCardProps {
    data: Comment
    postID: string

}

export default function ReplyCard({ data, postID }: ReplyCardProps) {

    const user = getCurrentUser()
    const [isLiked, setIsLiked] = useState(data.likedBy?.some(like => like.id === user?.id) || false)
    const [likeCount, setLikeCount] = useState(data.likedBy?.length || 0)
    const [likeReply] = useMutation(LIKE_COMMENT)
    const [unlikeReply] = useMutation(UNLIKE_COMMENT)
    const [createReply] = useMutation(CREATE_COMMENT)

    const [replyText, setReplyText] = useState('')
    const [replyOpen, setReplyOpen] = useState(false)

    const handleOpenCreateReply = () => {
        setReplyOpen(!replyOpen)
    }

    const handleCreateReply = async () => {
        if (replyText != '') {
            await createReply({
                variables: {
                    inputComment: {
                        text: replyText,
                        parentID: data.id
                    },
                    postID: postID
                }
            })
            setReplyText('')
        }
    }


    const handleLike = async () => {

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

        setIsLiked(!isLiked)
    }

    return (
        <div className={style['card-container']}>
            <div className={style['card-body']}>
                {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                <div>
                    <h5>{data.user.first_name} {data.user.last_name}</h5>
                    <p>{data.text}</p>
                    <div>
                        <h6>{timeSinceShort(new Date(data?.createdAt))}</h6>
                        {likeCount > 0 ? (
                            <p>{likeCount} likes</p>
                        ) : (
                            null
                        )}
                        <p onClick={handleOpenCreateReply}>Reply</p>
                    </div>
                </div>
                {isLiked ?
                    <AiFillHeart className={style['heart-icon-active']} onClick={handleLike} /> :
                    <AiOutlineHeart className={style['heart-icon']} onClick={handleLike} />
                }

            </div>
            <div className={style['reply-input-container']} style={replyOpen ? { display: 'flex' } : { display: 'none' }}>
                <div className={style['reply-input']}>
                    {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                    <div>
                        <input type="text" onChange={(e) => setReplyText(e.target.value)} value={replyText} placeholder="Write a reply..." />
                        <IoMdSend className={style['send-icon']} onClick={handleCreateReply} />
                    </div>
                </div>
            </div>

        </div >
    )
}