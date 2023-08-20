import style from '../../css/StoryPage.module.scss'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER_STORY } from '../../../query/StoryQuery'
import { Story } from '../../../model/StoryModel'
import { useState, useEffect } from 'react'
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'

export default function StoryPage() {

    const { userID } = useParams()
    const [arrLen, setArrLen] = useState(0)
    const [activeIdx, setActiveIdx] = useState(0)

    const { loading, data, refetch } = useQuery<{ getUserStory: Story[] }>(GET_USER_STORY, {
        variables: {
            userID: userID
        }
    })

    useEffect(() => {

        refetch()
        setActiveIdx(0)

    }, [userID])

    setTimeout(() => {
        handleClick('next')
    }, 5000)

    useEffect(() => {
        const nextTimer = setInterval(() => {
            handleClick('next')
        }, 5000)

        return () => clearInterval(nextTimer)
    }, [activeIdx])



    useEffect(() => {

        if (data?.getUserStory) {
            setArrLen(data?.getUserStory.length)
            console.log(arrLen);

        }

    }, [data])

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

    return (
        <div className={style['page-container']}>
            <div className={style['page-content']}>

                <div className={style['card-container']}>
                    <div className={style['bar-container']}>
                        {Array.from({ length: arrLen }).map((_, idx) => (
                            <div className={activeIdx > idx ? style['bar-active'] : style['bar']} key={idx + "-" + activeIdx}>
                                <div className={activeIdx == idx ? style['progress-bar'] : ''}></div>
                            </div>
                        ))}
                    </div>
                    {loading ? <h3 style={{ margin: 'auto', color: 'white' }}>Loading...</h3>
                        :
                        <img src={data?.getUserStory[activeIdx].fileURL || ''} />
                    }
                </div>
                <div className={style['arrow-container']}>
                    <div id={style['prev-arrow']} onClick={() => handleClick('prev')}>
                        <GrFormPrevious className={style['arrow']} />
                    </div>
                    <div id={style['next-arrow']}>
                        <GrFormNext className={style['arrow']} onClick={() => handleClick('next')} />
                    </div>
                </div>
            </div>
        </div>
    )

}
