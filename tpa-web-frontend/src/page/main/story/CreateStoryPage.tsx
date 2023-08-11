import style from '../../css/CreateStoryPage.module.scss'
import { CgProfile } from 'react-icons/cg'
import { PiTextAaBold } from 'react-icons/pi'
import { IoMdPhotos } from 'react-icons/io'
import { getCurrentUser } from '../../component/MasterLayout'
import { useNavigate } from 'react-router-dom'

export default function CreateStoryPage() {

    const navigate = useNavigate()

    const toText = () => {
        navigate('/main/create-story/text')
    }

    const toPhoto = () => {
        navigate('/main/create-story/photo')
    }

    const user = getCurrentUser()

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <h3>Your Story</h3>
                    <div>
                        {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                        <h4>{user?.first_name + " " + user?.last_name}</h4>
                    </div>
                </div>
                <hr />
            </div>
            <div className={style['page-content']}>
                <div className={style['card-container']}>
                    <div className={style['card-photo-story']} onClick={toPhoto}>
                        <div className={style['icon-container']}>
                            <IoMdPhotos className={style['card-icon']} />
                        </div>
                        <h5>Create a Photo Story</h5>
                    </div>
                    <div className={style['card-text-story']} onClick={toText}>
                        <div className={style['icon-container']}>
                            <PiTextAaBold className={style['card-icon']}/>
                        </div>
                        <h5>Create a Text Story</h5>
                    </div>
                </div>
            </div>
        </div>
    )

}