import { useQuery } from '@apollo/client';
import style from './css/StoryNavbar.module.scss'
import { GET_ALL_STORY } from '../../query/StoryQuery';
import { Story } from '../../model/StoryModel';
import { CgProfile } from 'react-icons/cg'
import { AiOutlinePlus } from 'react-icons/ai'
import { timeSinceShort } from '../../helper/DateHelper';
import { useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom';

interface StoryNavbarProps {
    children: ReactNode;
}

export default function StoryNavbar({ children }: StoryNavbarProps) {

    const { loading: storyLoading, data: storiesData } = useQuery(GET_ALL_STORY)
    const [activeCardIdx, setActiveCardIdx] = useState<number>(0);

    const navigate = useNavigate()

    const toCreate = () => {
        navigate('/main/create-story/select')
    }

    const toAnotherUserStory = (userID: string) => {
        navigate(`/main/stories/${userID}`)
    }

    const handleClick = (idx: number, userID: string) => {
        setActiveCardIdx(idx);
        toAnotherUserStory(userID)
    };

    return (

        <div className={style['page-container']}>
            <div className={style['sidebar-container']}>

                <div className={style['sidebar']}>

                    <h2>Stories</h2>
                    <div className={style['sidebar-anchor']}>
                        <a href="">Archive</a>
                        <a href="">Settings</a>
                    </div>

                    <h4>Your story</h4>
                    <div className={style['sidebar-your-story']}>
                        <AiOutlinePlus className={style['create-icon']} onClick={toCreate}/>
                        <div>
                            <h5>Create a story</h5>
                            <p>Share a photo or write something.</p>
                        </div>
                    </div>

                    <h4>All Stories</h4>
                    {storyLoading ? (
                        <p>Loading stories...</p>
                    ) : (
                        storiesData.getAllStory.reduce((uniqueStories: Story[], story: Story) => {
                            if (!uniqueStories.some((uniqueStory) => uniqueStory.user.id === story.user.id)) {
                                uniqueStories.push(story);
                            }
                            return uniqueStories;
                        }, []).map((data: Story, idx: number) => (
                            <UserStoryCard key={data.id} data={data} idx={idx} activeCardIdx={activeCardIdx} handleClick={handleClick} />
                        ))
                    )}
                </div>
            </div>
            <div className={style['child-container']}>
                {children}
            </div>
        </div>

    )
}

interface UserStoryCardProps {
    data: Story
    idx: number
    activeCardIdx: number
    handleClick: (idx: number, userID: string) => void
}

function UserStoryCard({ data, idx, activeCardIdx, handleClick }: UserStoryCardProps) {

    const active = activeCardIdx == idx
    const cardClassName = active ? `${style['user-story-card']} ${style['user-story-card-active']}` : style['user-story-card'];



    return (
        <div className={cardClassName} onClick={() => handleClick(idx, data.user.id)}>
            {data.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div>
                <h5>{data.user.first_name + ' ' + data.user.last_name}</h5>
                <h6>{timeSinceShort(new Date(data.createdAt))}</h6>
            </div>
        </div>
    );
}
