import { CgProfile } from 'react-icons/cg'
import style from './css/ChatRoomComponent.module.scss'
import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { CREATE_CHAT, GET_CHAT, GET_CHAT_ROOM } from '../../query/ChatQuery'
import { Chat, ChatRoom } from '../../model/ChatModel'
import { useState, useEffect } from 'react'
import { ShowUser } from '../../model/UserModel'
import { getCurrentUser } from './MasterLayout'
import { IoMdCall, IoMdInformationCircle, IoMdSend } from 'react-icons/io'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { OtherUserChat, UserChat } from './card/UserChat'

interface ChatRoomComponentProps {
    chatRoomID: string
}

export default function ChatRoomComponent({ chatRoomID }: ChatRoomComponentProps) {

    const user = getCurrentUser()
    const [otherUser, setOtherUser] = useState<ShowUser>()

    const [text, setText] = useState('')
    const [fileURL, setFileURL] = useState('')
    const [createChat] = useMutation(CREATE_CHAT)

    const { data: chatRoomData } = useQuery<{ getChatRoom: ChatRoom }>(GET_CHAT_ROOM, {
        variables: {
            chatRoomID: chatRoomID
        }
    })

    useEffect(() => {

        setOtherUser(chatRoomData?.getChatRoom.user.filter(chatRoomUser => chatRoomUser.id != user?.id)[0])

    }, [chatRoomData])

    const { loading: chatLoading, data: chatData } = useSubscription<{ getChat: Chat[] }>(GET_CHAT, {
        variables: {
            chatRoomID: chatRoomID
        }
    })

    if (chatLoading) {
        return <h3>Loading chat...</h3>
    }

    const handleCreateChat = async () => {
        if (text != '' || fileURL != '') {
            await createChat({
                variables: {
                    inputChat: {
                        chatRoomID: chatRoomID,
                        text: text,
                        fileURL: fileURL
                    }
                },
            })
            setText('')
        }
    }    

    const handleEnter : React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleCreateChat(); 
        }
    };

    return (
        <div className={style['page-container']}>

            <div className={style['navbar']}>
                <div className={style['navbar-profile']}>
                    {chatRoomData?.getChatRoom.group ?
                        (chatRoomData.getChatRoom.group.bannerImageURL ?
                            <img src={chatRoomData.getChatRoom.group.bannerImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />)
                        :
                        (otherUser?.profileImageURL ? <img src={otherUser?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />)}
                    {chatRoomData?.getChatRoom.group ? <h5>{chatRoomData?.getChatRoom.group.name}</h5>
                        :
                        <h5>{otherUser?.first_name + " " + otherUser?.last_name}</h5>
                    }

                </div>
                <div className={style['navbar-icons']}>
                    <IoMdCall className={style['navbar-icon']} />
                    <BsFillCameraVideoFill className={style['navbar-icon']} />
                    <IoMdInformationCircle className={style['navbar-icon']} />
                </div>
            </div>
            <div className={style['page-content']}>
                <div className={style['chat-container']}>
                    {chatData?.getChat.map((data) => {
                        
                        if (data.user.id == user?.id) {
                            console.log(data);
                            return (<UserChat key={data.id} data={data} />)
                        } else {
                            return (<OtherUserChat key={data.id} data={data} />)
                        }
                    })}
                </div>
            </div>
            <div className={style['chat-input-container']}>
                <div className={style['chat-input']}>
                    {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                    <div>
                        <input type="text" onChange={(e) => setText(e.target.value)} value={text} placeholder="Write a chat..." onKeyDown={handleEnter} />
                        <IoMdSend className={style['send-icon']} onClick={handleCreateChat}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

