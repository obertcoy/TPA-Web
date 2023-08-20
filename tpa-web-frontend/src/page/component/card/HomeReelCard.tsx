import style from './css/HomeReelCard.module.scss'
import { Reel } from '../../../model/ReelModel'

interface HomeStoryCardProps {
    data: Reel
    toReelPage: (reelID: string) => void
}

export default function HomeReelCard({ data,  toReelPage }: HomeStoryCardProps) {

    return (
        <div className={style['card-container']} onClick={() => toReelPage(data.id)}>
            <video src={data.fileURL || ''} className={style['reel-bg']} />
            <div className={style['name-container']}>
                <h6>{data.user.first_name} {data.user.last_name}</h6>
            </div>
            <div className={style['overlay']}></div>
        </div>
    )
}