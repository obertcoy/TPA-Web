import { useMutation, useQuery } from '@apollo/client'
import style from '../../css/ReelPage.module.scss'
import { useState, useEffect } from 'react'
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'
import { Reel } from '../../../model/ReelModel'
import { CREATE_REEL_COMMENT, GET_ALL_REEL, GET_REEL, LIKE_REEL, UNLIKE_REEL } from '../../../query/ReelQuery'
import { useNavigate } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import { timeSinceLong } from '../../../helper/DateHelper'
import CommentCard from '../../component/card/CommentCard'
import { IoMdSend } from 'react-icons/io'
import { getCurrentUser } from '../../component/MasterLayout'
import { BiSolidArrowFromRight, BiSolidArrowToRight } from 'react-icons/bi'
import { BiSolidLike } from 'react-icons/bi'
import { PiShareFatFill } from 'react-icons/pi'
import { FaComment } from 'react-icons/fa'

export default function ReelPage() {

    const [arrLen, setArrLen] = useState(0)
    const [activeIdx, setActiveIdx] = useState(0)
    const [videoLoaded, setVideoLoaded] = useState(false);

    const [likeCount, setLikeCount] = useState(0)
    const [commentText, setCommentText] = useState('')

    const { loading: loading, data } = useQuery<{ getAllReel: Reel[] }>(GET_ALL_REEL)
    const { data: reeldata, refetch: refetchReel } = useQuery<{ getReel: Reel }>(GET_REEL, {
        variables: {
            reelID: data?.getAllReel[activeIdx].id
        },
        skip: !data

    }
    )

    const navigate = useNavigate()

    const [likeReel] = useMutation(LIKE_REEL)
    const [unlikeReel] = useMutation(UNLIKE_REEL)
    const [createReelComment] = useMutation(CREATE_REEL_COMMENT)

    const [activeReel, setActiveReel] = useState<Reel>(reeldata?.getReel as Reel)
    const [isLiked, setIsLiked] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(false)

    const user = getCurrentUser()

    useEffect(() => {

        const check = sessionStorage.getItem('startReelPage')

        if (check && data?.getAllReel) {

            setArrLen(data?.getAllReel.length)
            const idx = data?.getAllReel.findIndex(data => data.id.includes(check))
            console.log(idx);
            if (idx != -1) {
                setActiveIdx(idx)
                setVideoLoaded(true)
            } else {
                navigate('/main/home')
            }

        }

    }, [loading])

    useEffect(() => {
        refetchReel()
        if (reeldata) {
            setActiveReel(reeldata?.getReel as Reel)

        }

    }, [activeIdx, reeldata])

    useEffect(() => {

        if (activeReel) {

            setLikeCount(activeReel.likedBy?.length || 0)
            setIsLiked(activeReel.likedBy?.some(like => like.id === user?.id) || false)
        }
    }, [activeReel])


    const handleClick = (type: string) => {

        if (type == 'prev') {

            if (activeIdx > 0) {
                setActiveIdx(activeIdx - 1)
            }
        } else if (type == 'next') {

            if (activeIdx < arrLen - 1) {
                setActiveIdx(activeIdx + 1)
            }
        }

    }

    const handleLike = async () => {

        if (!isLiked) {
            await likeReel({
                variables: {
                    reelID: activeReel.id
                }
            })
            setLikeCount(likeCount + 1)

        }
        else {
            await unlikeReel({
                variables: {
                    reelID: activeReel.id
                }
            })
            setLikeCount(likeCount - 1)

        }

        setIsLiked(!isLiked)
    }

    const handleCreateComment = async () => {
        if (commentText != '') {
            await createReelComment({
                variables: {
                    inputReelComment: {
                        text: commentText
                    },
                    reelID: activeReel.id
                },
            })
            setCommentText('')
            refetchReel()
        }
    }

    const handleOpenSidebar = () => {
        setOpenSidebar(!openSidebar)
    }

    if (!activeReel) {
        return <p>Loading...</p>
    }

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar-container']} style={openSidebar ? { display: 'flex' } : { display: 'none' }}>
                <div className={style['sidebar']}>
                    <div className={style['sidebar-profile']}>
                        {activeReel.user.profileImageURL ? <img src={activeReel.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                        <div>
                            <h5>{activeReel.user.first_name + " " + activeReel.user.last_name}</h5>
                            <h6>{timeSinceLong(new Date(activeReel.createdAt || ""))}</h6>
                        </div>
                    </div>
                    <div className={style['sidebar-text']}>
                        {activeReel.text}
                    </div>
                    <hr />
                    {activeReel.comment && activeReel.comment.length > 0 ? (
                        <div className={style['comment-container']}>
                            {activeReel.comment.filter(commentData => commentData.parentID == null).map((commentData) => (
                                <CommentCard key={commentData.id} data={commentData} postID={null} reelID={activeReel.id} refetch={refetchReel} />
                            ))}
                        </div>
                    ) :
                        <h3>No comment...</h3>
                    }
                </div>
                <div className={style['comment-input-container']}>
                    <div className={style['comment-input']}>
                        {activeReel.user.profileImageURL ? <img src={activeReel.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                        <div>
                            <input type="text" onChange={(e) => setCommentText(e.target.value)} value={commentText} placeholder="Write a comment..." />
                            <IoMdSend className={style['send-icon']} onClick={handleCreateComment} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['page-content']}>
                <div className={style['create-reel']} onClick={() => navigate('/main/create-reel')}>
                    <h5>Create Reel</h5>
                </div>
                {
                    openSidebar ?
                        <BiSolidArrowFromRight className={style['open-icon']} onClick={handleOpenSidebar} />
                        :
                        <BiSolidArrowToRight className={style['open-icon']} onClick={handleOpenSidebar} />
                }
                <div className={style['content-container']}>


                    <div className={style['card-container']}>

                        {loading || !videoLoaded ? <h3 style={{ margin: 'auto', color: 'white' }}>Loading...</h3>
                            :
                            <video
                                src={activeReel.fileURL || ''}
                                onLoadedData={() => setVideoLoaded(true)}
                                controls autoPlay onEnded={() => handleClick('next')}
                            />}

                    </div>
                    <div className={style['arrow-container']}>
                        <div id={style['prev-arrow']} onClick={() => handleClick('prev')}>
                            <GrFormPrevious className={style['arrow']} />
                        </div>
                        <div id={style['next-arrow']}>
                            <GrFormNext className={style['arrow']} onClick={() => handleClick('next')} />
                        </div>
                    </div>
                    <div className={style['card-interact']}>
                        <div className={isLiked ? style['card-like-active'] : style['card-like']} onClick={handleLike}>
                            <BiSolidLike className={style['interact-icon']} />
                            <p>{likeCount}</p>
                        </div>
                        <div className={style['card-comment']} onClick={handleOpenSidebar}>
                            <FaComment className={style['interact-icon']} />
                            <p>{activeReel.comment?.length}</p>
                        </div>
                        <div className={style['card-share']}>
                            <PiShareFatFill className={style['interact-icon']} />
                            <p>{activeReel.sharedBy?.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
