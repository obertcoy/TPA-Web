import style from './css/HomeStoryCard.module.scss'
import { Story } from "../../../model/StoryModel"
import { CgProfile } from 'react-icons/cg'

interface HomeStoryCardProps {
    data: Story
    toUserStory: (userID: string) => void
}

export default function HomeStoryCard({ data, toUserStory }: HomeStoryCardProps) {

    console.log(data);

    return (
        <div className={style['card-container']} onClick={() => toUserStory(data.user.id)}>
            {data.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <img src={data.fileURL || ''} alt="story image" className={style['story-bg']} />
            <h6>{data.user.first_name} {data.user.last_name}</h6>
            <div className={style['overlay']}></div>
        </div>
    )
}