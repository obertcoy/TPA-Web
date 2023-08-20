import { CgProfile } from "react-icons/cg";
import { Chat } from "../../../model/ChatModel";
import style from './css/UserChat.module.scss'

interface UserChatProps {
    data: Chat
}

export function OtherUserChat({ data }: UserChatProps) {
    console.log(data);
    
    return (
        <div className={style['other-chat-container']}>
            {data?.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div className={style['other-chat-subcontainer']}>
                <h5>{data.user?.first_name + " " + data.user?.last_name}</h5>
                <div className={style['other-chat-content']}>
                    {data.text ?
                        <span>{data.text}</span>
                        :
                        (data.fileURL.includes('mp4')
                            ?
                            <video src={data.fileURL} controls className={style['file']}></video>
                            :
                            <img src={data.fileURL} alt="chat img" className={style['file']} />
                        )
                    }
                </div>
            </div>

        </div>
    )

}

export function UserChat({ data }: UserChatProps) {
    console.log(data);
    
    return (
        <div className={style['chat-container']}>
            {data?.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div className={style['chat-subcontainer']}>
                <h5>{data.user?.first_name + " " + data.user?.last_name}</h5>
                <div className={style['chat-content']}>
                    {data.text ?
                        <span>{data.text}</span>
                        :
                        (data.fileURL.includes('mp4')
                            ?
                            <video src={data.fileURL} controls className={style['file']}></video>
                            :
                            <img src={data.fileURL} alt="chat img" className={style['file']} />
                        )
                    }
                </div>
            </div>
            
        </div>
    )

}