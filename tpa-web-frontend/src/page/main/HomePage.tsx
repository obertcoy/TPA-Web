import style from '../css/HomePage.module.scss'
import { HiBookOpen, HiVideoCamera } from 'react-icons/hi'
import { PiVideoFill } from 'react-icons/pi'
import { BsPlusCircleFill } from 'react-icons/bs'
import { BiSolidSmile } from 'react-icons/bi'
import { IoMdPhotos } from 'react-icons/io'
import { useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import CreatePostModal from '../component/modal/CreatePostModal'
import { useQuery } from '@apollo/client'
import { GET_ALL_POST } from '../../query/PostQuery'
import PostCard from '../component/card/PostCard'
import { Post } from '../../model/PostModel'
import { getCurrentUser } from '../component/MasterLayout'
import PostModal from '../component/modal/PostModal'
import { useNavigate } from 'react-router-dom'
import { GET_ALL_STORY } from '../../query/StoryQuery'
import HomeStoryCard from '../component/card/HomeStoryCard'
import { Story } from '../../model/StoryModel'
import { GET_ALL_REEL } from '../../query/ReelQuery'
import HomeReelCard from '../component/card/HomeReelCard'
import { Reel } from '../../model/ReelModel'

export default function HomePage() {

    const [activeHeader, setActiveHeader] = useState('stories')
    const [openCreatePost, setOpenCreatePost] = useState(false)
    const [openPostModal, setOpenPostModal] = useState(false)
    const [postModalID, setPostModalID] = useState<string>('')

    const navigate = useNavigate()

    const toCreateStory = () => {
        navigate('/main/create-story/select')
    }

    const toCreateReel = () => {
        navigate('/main/create-reel/')
    }

    const toUserStory = (userID: string) => {
        navigate(`/main/stories/${userID}`)
    }

    const toReelPage = (reelID: string) => {
        sessionStorage.setItem('startReelPage', reelID)
        navigate(`/main/reels/`)
    }

    const handleHeader = (header: string) => {

        setActiveHeader(header)
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

    const { loading, data, refetch: refetchGetAllPost } = useQuery(GET_ALL_POST)
    const { loading: storyLoading, data: storiesData } = useQuery(GET_ALL_STORY)
    const { loading: reelLoading, data: reelsData } = useQuery(GET_ALL_REEL)

    const user = getCurrentUser()

    console.log(activeHeader);
    return (
        <>
            {openCreatePost && <CreatePostModal handleOpenCreatePost={handleOpenCreatePost} refetchGetAllPost={refetchGetAllPost} initialGroup={null}/>}
            {openPostModal && postModalID && <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} />}

            <div className={style['page-container']}>
                <div className={style['post-container']}>
                    <div className={style['header-card']}>
                        <div className={style['header-title-container']}>
                            <div className={activeHeader == 'stories' ? style['header-title-active'] : ''} onClick={() => handleHeader('stories')}>
                                <HiBookOpen className={style['header-title-icon']} />
                                <h5>Stories</h5>
                            </div>
                            <div className={activeHeader == 'reels' ? style['header-title-active'] : ''} onClick={() => handleHeader('reels')}>
                                <PiVideoFill className={style['header-title-icon']} />
                                <h5>Reels</h5>
                            </div>
                        </div>
                        <hr />
                        <div className={style['header-content-container']}>
                            {activeHeader == 'stories' ?
                                <div className={style['create-card']} onClick={toCreateStory}>
                                    <div className={style['create-icon-container']}>
                                        <BsPlusCircleFill className={style['create-icon']} />
                                    </div>
                                    <div className={style['create-card-text']}>
                                        <h6>Create Story</h6>
                                    </div>
                                    <div className={style['overlay']}></div>
                                </div>
                                :
                                <div className={style['create-card']} onClick={toCreateReel}>
                                    <div className={style['create-icon-container']}>
                                        <BsPlusCircleFill className={style['create-icon']} />
                                    </div>
                                    <div className={style['create-card-text']}>
                                        <h6>Create Reel</h6>
                                    </div>
                                    <div className={style['overlay']}></div>                                </div>
                            }
                            {activeHeader == 'stories' && storyLoading ? (
                                <p>Loading stories...</p>
                            ) : (
                                activeHeader == 'stories' && storiesData.getAllStory.reduce((uniqueStories: Story[], story: Story) => {
                                    if (!uniqueStories.some((uniqueStory) => uniqueStory.user.id === story.user.id)) {
                                        uniqueStories.push(story);
                                    }
                                    return uniqueStories;
                                }, []).map((data: Story) => (
                                    <HomeStoryCard key={data.id} data={data} toUserStory={toUserStory} />
                                ))
                            )}
                            {activeHeader == 'reels' && reelLoading ? (
                                <p>Loading reels...</p>
                            ) : (
                                activeHeader == 'reels' &&
                                reelsData.getAllReel.map((data: Reel) => (
                                    <HomeReelCard data={data} toReelPage={toReelPage} />
                                ))
                            )
                            }


                        </div>
                    </div>
                    <div className={style['create-post-container']}>
                        <div className={style['create-post-input']}>
                            {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                            <button onClick={handleOpenCreatePost}>What's on your mind, {user?.first_name}?</button>
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
                    {
                        loading ?
                            <div>
                                <p>Loading...</p>
                            </div>
                            : data.getAllPost?.map((data: Post) => (
                                <PostCard
                                    key={data.id}
                                    data={data}
                                    liked={data.likedBy?.some(like => like.id === user?.id) || false}
                                    handleOpenPostModal={handleOpenPostModal}
                                />
                            ))
                    }
                </div>
            </div>
        </>
    )
}